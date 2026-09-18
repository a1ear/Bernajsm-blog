"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { runAction, type ActionResult } from "@/lib/action-result";
import { loginSchema, type LoginInput } from "@/lib/validation";

/**
 * `login` and `logout` are the ONLY exports here, and that is load-bearing:
 * every export of a `"use server"` module becomes a server action reference,
 * not the value. `loginSchema` lives in `@/lib/validation` so the login form
 * can hand a real Zod schema to `zodResolver`. See AGENTS.md.
 */

export async function login(values: LoginInput): Promise<ActionResult> {
  let target = "/bjsm-write";

  const result = await runAction(async () => {
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      return {
        ok: false as const,
        error: "Check the email and password fields.",
      };
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });

    if (error || !data.user) {
      // Deliberately vague: don't confirm whether the address exists.
      return { ok: false as const, error: "Incorrect email or password." };
    }

    target = parsed.data.next ?? "/bjsm-write";
    return { ok: true as const };
  });

  if (!result.ok) return result;

  revalidatePath("/", "layout");
  redirect(target);
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/bjsm-write/login");
}
