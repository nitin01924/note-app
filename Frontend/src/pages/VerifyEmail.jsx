import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`,
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        setStatus("success");
        setMessage(data.message || "Email verified successfully");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Verification failed");
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen text-center">
      {status === "loading" && <h2>Verifying your email...</h2>}
      {status === "success" && <h2 className="text-green-500">{message}</h2>}
      {status === "error" && <h2 className="text-red-500">{message}</h2>}
    </div>
  );
}

export default VerifyEmail;
