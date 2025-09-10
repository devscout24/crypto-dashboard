import { LoginForm } from "./LoginForm";
import sideImage from "@/assets/image/login-side-image.gif";
import logoIMage from "@/assets/image/logo.svg";

export default function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <div className="login-form">
          <div className="login-header">
            <h1 className="login-title">
              Login to{" "}
              <span className="text-primary inline-flex justify-start">
                Vault <img src={logoIMage} alt="" className="w-10 h-auto" />
              </span>
            </h1>
            <p className="login-subtitle">
              To keep connected with us please login with your personal info
            </p>
          </div>

          <LoginForm />

          <div className="social-login"></div>
          <div className="register-link"></div>
        </div>
      </div>
      <div className="login-image-wrapper">
        <img src={sideImage} alt="Crypto Animation" className="login-image" />
      </div>
    </div>
  );
}
