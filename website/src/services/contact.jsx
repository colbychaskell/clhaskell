const processContactForm = async (name, email, phone, topic, message) => {
  console.log(import.meta.env.VITE_API_URL);

  const _csrf = 'dummy';
  const body = JSON.stringify({
    name: name,
    email: email,
    phone: phone,
    topic: topic,
    message: message,
    csrf: _csrf,
  });

  const headers = {'Content-Type': 'application/json'};
  const url = import.meta.env.VITE_API_URL + "/api/contact";
  console.log(import.meta.env.VITE_API_URL);
  
  // Post form data to backend
  const response = await fetch(url, {method: 'POST', body, headers})

  if (!response.ok) {
    const res = await response.json();
    throw new Error(res.message);
  }

  return response.json();
}

export default processContactForm;