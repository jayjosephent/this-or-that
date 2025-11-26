import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CustomBracket } from "@/lib/customBrackets";

// GET - Fetch all custom brackets for the current user
export async function GET() {
  try {
    const supabase = await createClient();
    
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ brackets: [] }, { status: 200 });
    }

    // Fetch brackets from database
    const { data, error } = await supabase
      .from("custom_brackets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching brackets:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ brackets: data || [] });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or update a custom bracket
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bracket: CustomBracket = await request.json();

    // Validate bracket data
    if (!bracket.id || !bracket.name || !bracket.mode || !bracket.options) {
      return NextResponse.json(
        { error: "Invalid bracket data" },
        { status: 400 }
      );
    }

    // Upsert bracket (insert or update)
    const { data, error } = await supabase
      .from("custom_brackets")
      .upsert(
        {
          id: bracket.id,
          user_id: user.id,
          name: bracket.name,
          mode: bracket.mode,
          options: bracket.options,
          must_start: bracket.mustStart || [],
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "id,user_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error saving bracket:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bracket: data });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a custom bracket
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const bracketId = searchParams.get("id");

    if (!bracketId) {
      return NextResponse.json(
        { error: "Bracket ID required" },
        { status: 400 }
      );
    }

    // Delete bracket
    const { error } = await supabase
      .from("custom_brackets")
      .delete()
      .eq("id", bracketId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting bracket:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}



