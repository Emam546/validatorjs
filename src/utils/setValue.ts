export function setAllValues(inputs: any, path: string,value:any): Boolean[]{
    if (!path.length) return [false]
    const keys = path.split(".");
    let currObj = inputs;
    for (let i = 0; i < keys.length-1; i++) {
        const key = keys[i];
        if (key.startsWith("*")) {
            const returnedPath = keys.slice(i + 1).join(".");
            let allValues:ReturnType<typeof setAllValues> = [];
            for (const key in currObj)
                allValues = [
                    ...allValues,
                    ...setAllValues(currObj[key], returnedPath,value),
                ];

            return allValues;
        } else currObj = currObj[key];
        if(currObj===undefined)
            return [false]
    }
    const key=keys.at(-1)
    if(key===undefined)
        return [false]
    if (key.startsWith("*")) {
        for (const key in currObj)
            currObj[key]=value
    }else
        currObj[key]=value
    return [true]
}
export function setValue(inputs: any, path: string,value:any):boolean {
    const keys = path.split(".");
    let currObj: any = inputs;
    for (let i = 0; i < keys.length-1 && currObj != undefined; i++) {
        const key = keys[i];
        if (key.startsWith("*")) {
            const index = parseInt(key.slice(1));
            if (!isNaN(index)) {
                currObj = currObj[index];
                if (currObj != undefined) continue;
            }
        } else currObj = currObj[key];
    }
    if(currObj===undefined)
        return false
    const key=keys.at(-1)
    if(key===undefined)
        return false
    if (key.startsWith("*")) {
        const index = parseInt(key.slice(1));
        if (isNaN(index))
            return false
        currObj[index]=value
        
    }else
        currObj[key]=value

    return true;
}