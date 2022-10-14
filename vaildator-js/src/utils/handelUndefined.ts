import { StoredMessage } from "../Rule";

export default function(val:StoredMessage|undefined){
    if(val!=undefined)return val
    throw new Error("The defined message type is not recognizable")
}