// This script creates the first admin user
// Run this after setting up the admin_users table

const ADMIN_EMAIL = "admin@leasesmallspace.com"
const ADMIN_PASSWORD = "admin123456"

console.log("🚀 Creating first admin user...")
console.log("📧 Email:", ADMIN_EMAIL)
console.log("🔑 Password:", ADMIN_PASSWORD)
console.log("")
console.log("⚠️  IMPORTANT: Change this password after first login!")
console.log("")
console.log("To create the admin user, visit:")
console.log("👉 /api/admin/create-user")
console.log("")
console.log("Or use the admin creation API endpoint with these credentials.")
