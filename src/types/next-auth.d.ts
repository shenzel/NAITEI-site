import 'next-auth';

declare module 'next-auth' {
    /*userSessioの'dateuserやgetrServersessionの戻り値の型 */
    interface Session {
        user: {
            id: string;
        } & DefaultSession['user'];
    }
}