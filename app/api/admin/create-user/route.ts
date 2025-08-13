import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase"

// Check if admin client is available
if (!supabaseAdmin) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is not configured")
}

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin functionality not configured" }, { status: 500 })
    }

    const { email, fullName, password } = await request.json()

    if (!email || !fullName || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = createRouteHandlerClient<Database>({ cookies })

    // Check if the current user is an admin
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: currentAdmin } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", session.user.id)
      .single()

    if (!currentAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Failed to create user account" }, { status: 500 })
    }

    // Add user to users table
    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          id: authData.user.id,
          email,
          full_name: fullName,
        },
      ])
      .select()

    if (userError) {
      console.error("User table error:", userError)
      // Clean up auth user if database insert fails
      await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      return NextResponse.json({ error: "Failed to create user profile" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      user: userData[0],
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to create your specific user
export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Admin functionality not configured" }, { status: 500 })
    }

    console.log("Creating Nate's admin user...")

    // Create user in Supabase Auth using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: "nate@secureassetmg.com",
      password: "Nathaniel88@@",
      email_confirm: true, // Auto-confirm email
    })

    if (authError) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    console.log("User created in auth:", authData.user?.id)

    // Add user to users table
    if (authData.user) {
      const { data: userData, error: dbError } = await supabaseAdmin
        .from("users")
        .insert([
          {
            id: authData.user.id,
            email: authData.user.email,
            full_name: "Nate",
          },
        ])
        .select()

      if (dbError) {
        console.error("Database error:", dbError)
        // Clean up auth user if database insert fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
      } else {
        console.log("User added to users table")
      }
    }

    return NextResponse.json({
      success: true,
      message: "Nate's admin user created successfully",
      user: authData.user,
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
