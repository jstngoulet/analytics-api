
import getRequest from './getRequest';
import postRequest from './postRequest';
import putRequest from './putRequest';

export { getRequest, putRequest, postRequest };

/**
 * Sample Request: 
 * 
    import { getRequest, postRequest } from './api/RequestHandlers';
 * 
 *   try {
        const response = await postRequest<{ id: number }>(
        "https://jsonplaceholder.typicode.com/posts",
        { title: "my post", body: "some content" }
        );
        res.status(200).json(response.parsedBody);
    } catch (err) {
        console.log('error: ${err}');;
        res.status(401).json(err);
    }
 */