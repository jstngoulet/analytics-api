import { Request, Response, NextFunction, RequestHandler } from "express";
import db from "../../DatabaseConnection/db";
import { fetchUser } from "../Auth/auth";
import { v4 as uuid } from "uuid";

export default interface AnalyticEvent {
  app_id: string;
  user_id: string; // UUID stored as string
  category: string;
  action: string;
  label?: string; // Optional field
  properties?: Record<string, any>; // Ensure JSONB compatibility
  timestamp: string; // ISO 8601 timestamp
}

/**
 * Converts req.body into a properly typed AnalyticEvent
 */
function parseAnalyticEvent(body: any): AnalyticEvent {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body, expected an object.");
  }

  // Validate required fields
  if (
    !body.app_id ||
    !body.user_id ||
    !body.category ||
    !body.action ||
    !body.timestamp
  ) {
    throw new Error(
      "Missing required fields: app_id, user_id, category, action, timestamp."
    );
  }

  // Handle properties correctly
  let properties: Record<string, any> = {};

  if (typeof body.properties === "string") {
    // If properties is a string, try to parse it as JSON
    try {
      properties = JSON.parse(body.properties); // Parse the JSON string to an object
    } catch (e) {
      throw new Error("Invalid JSON format in properties"); // Invalid JSON in the request
    }
  } else if (typeof body.properties === "object" && body.properties !== null) {
    // If properties is already an object, use it directly
    properties = body.properties;
  }

  // Return the event as an AnalyticEvent
  return {
    app_id: String(body.app_id),
    user_id: String(body.user_id),
    category: String(body.category),
    action: String(body.action),
    label: body.label ? String(body.label) : undefined,
    properties, // Safely assigned properties
    timestamp: new Date(body.timestamp).toISOString(),
  };
}

export const sendEvent = async (req: Request, res: Response) => {
  try {
    const event = parseAnalyticEvent(req.body);

    console.log(`Proeprties: ${event.properties}`);
    console.log(`Type of Properties: ${typeof event.properties}`);

    if (!event) {
      res.status(403).json({ error: "Event is Missing fields" });
      return;
    }
    const currentUser = await fetchUser(event.user_id, undefined);

    if (!currentUser) {
      res.status(403).json({ error: `Cannot find userID ${event.user_id}` });
      return;
    }
    console.log(`User Found: ${currentUser.username}`);

    const createEventMutation = `
        INSERT INTO analytic_events 
            ( id, app_id, user_id, category, action, label, properties, local_timestamp, ip_address) 
        VALUES 
            ($1, $2, $3, $4, $5, $6, $7::jsonb, $8, $9);
        `;

    const eventId = uuid();
    const ip_address =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0] ||
      req.socket.remoteAddress ||
      undefined;

    const values = [
      eventId, // Generate new UUID for event ID
      event.app_id,
      event.user_id,
      event.category,
      event.action,
      event.label || null, // Handle optional field
      JSON.stringify(event.properties), // ✅ Ensure JSON.stringify() is used here
      new Date(event.timestamp).toISOString(), // Convert timestamp to Date
      ip_address, // Extracted IP address
    ];

    const dbResult = await db.query(createEventMutation, values);

    console.log(`DB Result from event Creation: ${dbResult}`);
    res.status(200).json({ message: "Event Created", id: eventId });
    return;
  } catch (err) {
    console.error(`Error found: ${err}`);
    res.status(500).json({ error: `${err}` });
  }
};
