export type LoginInput = {
  username: string;
  password: string;
};

export type LoginResponse = {
  accessToken: string;
  userId: string;
  username: string;
};

export async function login(input: LoginInput): Promise<LoginResponse> {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json();
}