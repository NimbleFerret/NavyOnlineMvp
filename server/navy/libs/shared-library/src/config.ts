export class Config {
    public static readonly WEB3_WORKER_SERVICE_PORT = 3010;
    public static readonly WEB3_WORKER_SERVICE_PORT_HTTP = 3009;
    public static readonly WEB3_SERVICE_PORT = 3020;
    public static readonly WORLD_SERVICE_PORT = 3021;
    public static readonly GATEWAY_SERVICE_PORT = 3022;
    public static readonly USER_SERVICE_PORT = 3023;
    public static readonly GAMEPLAY_BALANCER_SERVICE_PORT = 3024;
    public static readonly GAMEPLAY_BALANCER_SERVICE_PORT_HTTP = 3025;
    public static readonly AUTH_SERVICE_PORT = 3026;
    public static readonly MARKETPLACE_SERVICE_PORT = 3027;
    public static readonly NOTIFICATION_SERVICE_PORT = 3028;
    public static readonly ENTITY_SERVICE_PORT = 3029;

    public static readonly GAMEPLAY_SERVICE_DEFAULT_PORT = 4020;
    public static readonly GAMEPLAY_SERVICE_DEFAULT_REGION = 'EU';

    public static readonly TestEnv = false;

    private static RemoteRedis = false;
    private static DockerRedis = true;
    private static SecureRedis = true;

    public static GetRedisHost() {
        return {
            host: Config.DockerRedis ? 'navy-redis' : (Config.RemoteRedis ? '23.111.202.19' : 'localhost'),
            port: 6379,
            password: Config.SecureRedis ? 'khbadchgba6576tgfyuv' : ''
        }
    }

    public static MongoDBName = 'navy_test';

    public static GetMongoHost() {
        return `mongodb://${Config.TestEnv ? 'localhost' : 'navyuser:jhassct872hbJGFJgkcva2s@navy-mongodb'}`;
    }
}