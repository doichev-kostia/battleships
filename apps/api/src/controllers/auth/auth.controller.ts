import { Get, JsonController } from "routing-controllers";
import { AuthHandler } from "./auth.handler";

@JsonController("/authentication")
export class AuthController {
  @Get("/login")
  async login() {
    return AuthHandler.login();
  }
}
