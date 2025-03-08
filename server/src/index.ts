
import Kernel from "./infrastructure/Kernel";
import Server from "./infrastructure/net/Server";

(async() => {
    const kernel = new Kernel();
    let e = undefined;
    try {
        await kernel.init();
    } 
    catch(err)  {
        e = err;
    } 
    finally  {
        if(e)
        {
            throw e;
        }
        
        await kernel.start();
    }
})();