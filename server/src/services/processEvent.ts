import connectRedis from "../utils/redisClient";
import chalk from "chalk";

const redisCache = async(data) => {
    try {
        const redis = await connectRedis();

        // TODO: Store error event in Redis List
        
    }
}

export default redisCache;