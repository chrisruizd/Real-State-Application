import { useNavigate } from 'react-router-dom';



const handleLogin = async (e) => {
    e.preventDefault();

    const navigate = useNavigate();

  
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // <--- super important for sending the session cookie!
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });
  
    if (response.ok) {
      // ✅ Login successful — redirect to homepage
      navigate('/api/products'); // or navigate('/products') if that's the listing page
    } else {
      // ❌ Handle error
      const message = await response.text();
      alert('Login failed: ' + message);
    }
  };
  