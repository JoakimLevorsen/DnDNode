export interface LoginInfo {
    username: string;
    password: string;
}

export const isLoginInfo = (input: any): input is LoginInfo =>
    typeof input === "object" &&
    Object.keys(input).length === 2 &&
    typeof input.username === "string" &&
    typeof input.password === "string";
