"use client";

import { useState, useTransition } from "react";

import { login } from "./actions";

export function LoginForm({ next }: { next?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await login({ email, password, next });
      // A successful login redirects, so reaching here means it failed.
      if (result && !result.ok) setError(result.error);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-ink">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          autoCapitalize="none"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-ink/15 bg-warm-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-forest focus:ring-2 focus:ring-forest/15"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-ink">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-lg border border-ink/15 bg-warm-white px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-forest focus:ring-2 focus:ring-forest/15"
        />
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-900/15 bg-red-900/5 px-3 py-2 text-sm text-red-900"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-full bg-forest px-6 py-3 text-sm font-medium text-warm-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-dark disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
