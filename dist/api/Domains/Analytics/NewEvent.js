"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEvent = void 0;
const db_1 = __importDefault(require("../../DatabaseConnection/db"));
const auth_1 = require("../Auth/auth");
const uuid_1 = require("uuid");
/**
 * Converts req.body into a properly typed AnalyticEvent
 */
function parseAnalyticEvent(body) {
    console.error(`Body: ${JSON.stringify(body)}`);
    if (typeof body !== "object" || body === null) {
        throw new Error("Invalid request body, expected an object.");
    }
    // Validate required fields
    if (!body.app_id)
        throw new Error("Missing app_id");
    if (!body.user_id)
        throw new Error("Missing user_id");
    if (!body.category)
        throw new Error("Missing category");
    if (!body.action)
        throw new Error("Missing action");
    if (!body.label)
        throw new Error("Missing Label");
    if (!body.timestamp)
        throw new Error("Missing timestamp");
    // Handle properties correctly
    let properties = {};
    if (typeof body.properties === "string") {
        // If properties is a string, try to parse it as JSON
        try {
            properties = JSON.parse(body.properties); // Parse the JSON string to an object
        }
        catch (e) {
            throw new Error("Invalid JSON format in properties"); // Invalid JSON in the request
        }
    }
    else if (typeof body.properties === "object" && body.properties !== null) {
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
const sendEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.info(`Event: ${JSON.stringify(req.body)}`);
        const event = parseAnalyticEvent(req.body);
        console.log(`Proeprties: ${event.properties}`);
        console.log(`Type of Properties: ${typeof event.properties}`);
        if (!event) {
            res.status(403).json({ error: "Event is Missing fields" });
            return;
        }
        const currentUser = yield (0, auth_1.fetchUser)(event.user_id, undefined);
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
        const eventId = (0, uuid_1.v4)();
        const ip_address = ((_a = req.headers["x-forwarded-for"]) === null || _a === void 0 ? void 0 : _a.split(",")[0]) ||
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
        const dbResult = yield db_1.default.query(createEventMutation, values);
        console.log(`DB Result from event Creation: ${dbResult}`);
        res.status(200).json({ message: "Event Created", id: eventId });
        return;
    }
    catch (err) {
        console.error(`Error found: ${err}`);
        res.status(500).json({ error: `${err}` });
    }
});
exports.sendEvent = sendEvent;
