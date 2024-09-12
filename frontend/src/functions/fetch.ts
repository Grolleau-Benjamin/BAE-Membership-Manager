export const fetchWithAuth = async (url: string, method: string, token: string | null, body: any = null) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const data = await response.json();
      if (data.statusCode === 401) {
        return { logout: true };
      }
      return { error: data.message };
    }
    return await response.json();
  } catch (err) {
    return { error: "A network error occurred." };
  }
};

