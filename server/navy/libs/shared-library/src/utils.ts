export class Utils {

    public static DeleteKeysFromMap(map: Map<String, any>, keys: String[]) {
        keys.forEach(key => {
            map.delete(key);
        });
    }

}