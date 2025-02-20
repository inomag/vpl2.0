import React, { useState, useEffect } from "react";
import { Input, Button, Card, Typography, Spin } from "antd";
import { LogoutOutlined } from '@ant-design/icons';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import AuctionConsole from "./console";

const { Text } = Typography;

function Dashboard() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ Loading state

  // ✅ Restore authentication state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("authenticatedUser");
    if (storedUser) {
      setIsAuthenticated(true);
      setName(storedUser);
    }
  }, []);

  const handleLogin = async () => {
    setError(""); // Reset error on new login attempt
    setLoading(true); // Start loading

    if (!name || !password) {
      setError("Please enter both name and password.");
      setLoading(false);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const users = snapshot.docs.map((doc) => doc.data());

      // Check if user exists
      const user = users.find((u) => u.name === name);

      if (!user) {
        setError("User not found.");
        setLoading(false);
        return;
      }

      if (user.password !== password) {
        setError("Incorrect password.");
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);
      localStorage.setItem("authenticatedUser", name); // ✅ Store in localStorage
    } catch (error) {
      setError("Error logging in. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("authenticatedUser"); // ✅ Clear session on logout
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: '100%' }}>
      {isAuthenticated && <Button variant="solid" shape="circle" icon={<LogoutOutlined />} size={'large'} onClick={handleLogout} color='danger' style={{position: 'absolute', bottom: '16px', left: '16px'}} />}
      {isAuthenticated ? (
              <AuctionConsole user={name} />
      ) : (
        <Card style={{height: 'fit-content'}}>
          <h2>Login</h2>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Input.Password
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: 10 }}
          />
          <Button type="primary" block onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Submit"}
          </Button>

          {/* ✅ Loader & Error Message Below Button */}
          <div style={{ marginTop: 8, textAlign: "center" }}>
            {loading && <Spin size="small" />}
            {error && <Text type="danger" style={{ display: "block", marginTop: 8 }}>{error}</Text>}
          </div>
        </Card>
      )}
    </div>
  );
}

export default Dashboard;
