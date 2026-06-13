import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../src/server";
import axios from "axios";

function ActivationPage() {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const calledRef = useRef(false);


  useEffect(() => {
   
    if (activation_token && !calledRef.current) {
              calledRef.current=true;
               console.log("ACTIVATION EFFECT RUNNING");
      const activationEmail = async () => {
        try {
          const res = await axios.post(`${server}/user/activation`, {
            activation_token,
          });
          console.log(res.data.message);
          setMessage("Account activated successfully!");
        } catch (error) {
          setMessage(error.response?.data?.message || "Something went wrong");
          setError(true);
        };
      };
      activationEmail();
    }
  }, [activation_token]);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
     <div>
      {error ? <p>{message}</p> : <p>{message}</p>}
    </div>
    </div>
  );
}

export default ActivationPage;
