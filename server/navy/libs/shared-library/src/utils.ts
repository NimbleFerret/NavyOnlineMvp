export class Utils {

    public static readonly ERROR_EMAIL_EXISTS = 'EMAIL_EXISTS';
    public static readonly ERROR_EMAIL_NOT_FOUND = 'EMAIL_NOT_FOUND';
    public static readonly ERROR_WALLET_NOT_FOUND = 'WALLET_NOT_FOUND';
    public static readonly ERROR_WALLET_EXISTS = 'WALLET_EXISTS';
    public static readonly ERROR_BAD_SIGNATURE = 'BAD_SIGNATURE';
    public static readonly ERROR_BAD_AUTH = 'BAD_AUTH';
    public static readonly ERROR_BAD_PARAMS = 'BAD_PARAMS';
    public static readonly ERROR_BAD_EMAIL_OR_PASSWORD = 'BAD_EMAIL_OR_PASSWORD';
    public static readonly ERROR_PASSWORDS_DOES_NOT_MATCH = 'PASSWORDS_DOES_NOT_MATCH';
    public static readonly ERROR_ALREADY_FAVOURITE = 'ALREADY_FAVOURITE';
    public static readonly ERROR_NOT_A_FAVOURITE = 'NOT_A_FAVOURITE';

    public static DeleteKeysFromMap(map: Map<String, any>, keys: String[]) {
        keys.forEach(key => {
            map.delete(key);
        });
    }

    public static GetBearerTokenFromRequest(request: Request) {
        if (request.headers['authorization']) {
            return request.headers['authorization'].split(' ')[1] as string;
        } else {
            return undefined;
        }
    }

    public static GetDaysSeconds(days?: string) {
        const nowTimeSeconds = Number(Number(Date.now() / 1000).toFixed(0));
        const daySeconds = 24 * 60 * 60;
        let seconds = nowTimeSeconds;
        if (days) {
            if (days == '7') {
                seconds = nowTimeSeconds - (daySeconds * 7);
            } else if (days == '30') {
                seconds = nowTimeSeconds - (daySeconds * 30);
            } else {
                seconds = nowTimeSeconds - daySeconds;
            }
        }
        return seconds;
    }

}