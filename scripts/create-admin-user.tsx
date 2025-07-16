import { createClient } from "@supabase/supabase-js"

// Replace these with your actual Supabase URL and service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Supabase URL or service key is missing")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createAdminUser() {
  // Replace with the admin user details
  const adminEmail = "admin@leasesmallspace.com"
  const adminPassword = "securePassword123" // Change this to a secure password
  const adminName = "Admin User"

  try {
    // Create the user
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { full_name: adminName },
    })

    if (createError) throw createError

    if (!userData.user) throw new Error("Failed to create user")

    console.log("User created:", userData.user.id)

    // Add user to the users table
    const { error: userInsertError } = await supabase.from("users").insert({
      id: userData.user.id,
      email: userData.user.email!,
      full_name: adminName,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })

    if (userInsertError) throw userInsertError

    console.log("User added to users table")

    // Assign admin role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: userData.user.id,
      role: "admin",
      created_at: new Date().toISOString(),
    })

    if (roleError) throw roleError

    console.log("Admin role assigned")

    console.log("Admin user created successfully!")
    console.log("Email:", adminEmail)
    console.log("Password:", adminPassword)
    console.log("Please change this password after first login")
  } catch (error) {
    console.error("Error creating admin user:", error)
  }
}

createAdminUser()
