import { query, QueryCtx, MutationCtx, ActionCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";

type AuthContext = QueryCtx | MutationCtx | ActionCtx;

export async function requireAdminIdentity(ctx: AuthContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError("Authentication required");
  }

  const email = identity.email;
  if (email !== "hhwjsw711@gmail.com") {
    throw new ConvexError("Admin access required");
  }

  return { email, identity };
}

export async function getAdminIdentity(ctx: AuthContext) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    return null;
  }

  const email = identity.email;
  if (email !== "hhwjsw711@gmail.com") {
    return null;
  }

  return { email, identity };
}

export const loggedInUser = query({
  args: {},
  returns: v.union(
    v.object({
      email: v.optional(v.string()),
      name: v.optional(v.string()),
      pictureUrl: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    return {
      email: identity.email,
      name: identity.name,
      pictureUrl: identity.pictureUrl,
    };
  },
});

export const isAdmin = query({
  args: {},
  returns: v.boolean(),
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return false;
    }

    return identity.email === "hhwjsw711@gmail.com";
  },
});
