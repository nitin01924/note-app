import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");

      if (!token) {
        toast.error("Invalid verification link");
        return navigate("/");
      }

      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/verify-email?token=${token}`,
        );

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        toast.success("Email verified successfully!");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (error) {
        toast.error(error.message || "Verification failed");
        navigate("/");
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <h2 className="text-lg font-semibold">Verifying your email...</h2>
    </div>
  );
}

export default VerifyEmail;
