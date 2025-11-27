"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  getCustomBrackets,
  saveCustomBracket,
  deleteCustomBracket,
  generateBracketId,
  type CustomBracketMode,
  type CustomBracket,
} from "@/lib/customBrackets";
import { CATEGORY_OPTIONS, POOLS, type CategoryKey } from "@/lib/bracket";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";

type Step = "list" | "mode" | "options" | "confirm" | "mustStart" | "name";
type EditingBracket = CustomBracket | null;

type BracketListItem = (CustomBracket & { isBuiltIn?: false }) | {
  id: string;
  name: string;
  mode: CustomBracketMode;
  options: readonly string[];
  mustStart: string[];
  isBuiltIn: true;
};

export default function AdminPage() {
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [step, setStep] = useState<Step>("list");
  const [customBrackets, setCustomBrackets] = useState<CustomBracket[]>([]);
  const [editingBracket, setEditingBracket] = useState<EditingBracket>(null);
  
  // Form state
  const [mode, setMode] = useState<CustomBracketMode | null>(null);
  const [optionsText, setOptionsText] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [mustStart, setMustStart] = useState<string[]>([]);
  const [bracketName, setBracketName] = useState("");

  // Load brackets when user changes
  useEffect(() => {
    const loadBrackets = async () => {
      try {
        const brackets = await getCustomBrackets();
        setCustomBrackets(brackets);
      } catch (error) {
        console.error("Failed to load brackets:", error);
      }
    };
    loadBrackets();
  }, [user]);

  const resetForm = () => {
    setMode(null);
    setOptionsText("");
    setOptions([]);
    setMustStart([]);
    setBracketName("");
    setEditingBracket(null);
  };

  const startNewBracket = () => {
    resetForm();
    setStep("mode");
  };

  const startEditBracket = (bracket: BracketListItem) => {
    // Convert to CustomBracket format for editing
    const editBracket: CustomBracket = {
      id: bracket.id,
      name: bracket.name,
      mode: bracket.mode,
      options: [...bracket.options],
      mustStart: bracket.mustStart || [],
    };
    setEditingBracket(editBracket);
    setMode(bracket.mode);
    setOptions([...bracket.options]);
    setOptionsText(bracket.options.join("\n"));
    setMustStart(bracket.mustStart || []);
    setBracketName(bracket.name);
    setStep("options");
  };

  const handleModeSelect = (selectedMode: CustomBracketMode) => {
    setMode(selectedMode);
    setStep("options");
  };

  const handleOptionsSubmit = () => {
    const lines = optionsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const requiredCount = mode === 8 ? 8 : mode === 10 ? 10 : 12;
    if (lines.length < requiredCount) {
      alert(`Please enter at least ${requiredCount} options (one per line)`);
      return;
    }

    setOptions(lines);
    setStep("confirm");
  };

  const handleConfirm = () => {
    // Always go to mustStart step - user can select 0, 1, or 2 options
    setStep("mustStart");
  };

  const handleMustStartSelect = (option: string) => {
    setMustStart((prev) => {
      if (prev.includes(option)) {
        return prev.filter((o) => o !== option);
      }
      if (prev.length < 2) {
        return [...prev, option];
      }
      return prev;
    });
  };

  const handleMustStartConfirm = () => {
    setStep("name");
  };

  const handleSave = async () => {
    if (!bracketName.trim()) {
      alert("Please enter a bracket name");
      return;
    }

    if (!mode) return;

    const bracket: CustomBracket = {
      id: editingBracket?.id ?? generateBracketId(),
      name: bracketName.trim(),
      mode,
      options: options.slice(0, mode === 8 ? 8 : mode === 10 ? 10 : 12),
      mustStart,
    };

    try {
      await saveCustomBracket(bracket);
      const brackets = await getCustomBrackets();
      setCustomBrackets(brackets);
      alert(
        editingBracket
          ? `Bracket "${bracketName}" updated successfully!`
          : `Bracket "${bracketName}" saved successfully!`,
      );
      resetForm();
      setStep("list");
    } catch (error) {
      alert("Failed to save bracket. Please try again.");
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this bracket?")) {
      try {
        await deleteCustomBracket(id);
        const brackets = await getCustomBrackets();
        setCustomBrackets(brackets);
      } catch (error) {
        alert("Failed to delete bracket. Please try again.");
        console.error(error);
      }
    }
  };

  const builtInBrackets: BracketListItem[] = CATEGORY_OPTIONS.map((opt) => {
    const key = opt.value as CategoryKey;
    let mustStart: string[] = [];
    if (key === "guy") {
      mustStart = ["Tall Guy"];
    } else if (key === "matters") {
      mustStart = ["Looks 👀", "Personality 💬"];
    } else if (key === "girl") {
      mustStart = ["Curvy Girl", "Pretty Girl"];
    }
    return {
      id: opt.value,
      name: opt.label,
      mode: (key === "guy" ? 11 : key === "girl" || key === "fwds" || key === "str" || key === "mids" || key === "defs" || key === "gks" || key === "matters" ? 12 : 10) as CustomBracketMode,
      options: POOLS[key as keyof typeof POOLS] ?? [],
      mustStart,
      isBuiltIn: true,
    };
  });

  // Check which built-in brackets have been overridden
  const overriddenIds = new Set(customBrackets.map((b) => b.id));
  
  // Filter out built-in brackets that have custom overrides (show custom version instead)
  const builtInWithoutOverrides = builtInBrackets.filter((b) => !overriddenIds.has(b.id));
  
  const allBrackets: BracketListItem[] = [
    ...builtInWithoutOverrides,
    ...customBrackets.map((b) => {
      const isOverride = CATEGORY_OPTIONS.some((opt) => opt.value === b.id);
      return { ...b, isBuiltIn: isOverride ? true : false };
    }),
  ];

  if (step === "list") {
    return (
      <div className="wrap" style={{ maxWidth: "900px", padding: "24px" }}>
        <header className="header" style={{ marginBottom: "24px" }}>
          <div className="title">Admin Panel</div>
          <div className="spacer" />
          {authLoading ? (
            <span style={{ fontSize: "12px", color: "#666" }}>Loading...</span>
          ) : isAuthenticated ? (
            <>
              <span
                style={{
                  fontSize: "12px",
                  color: "#22c55e",
                  marginRight: "8px",
                  fontWeight: "bold",
                }}
              >
                ✓ Signed in as {user?.email}
              </span>
              <button
                type="button"
                className="btn small"
                onClick={async () => {
                  await signOut();
                  setCustomBrackets([]);
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              type="button"
              className="btn small"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In to Sync
            </button>
          )}
          <Link href="/" className="btn small" style={{ textDecoration: "none", marginLeft: "8px" }}>
            Back to Bracket
          </Link>
        </header>

        {showAuthModal && (
          <AuthModal
            onClose={() => setShowAuthModal(false)}
            onSuccess={() => {
              // Brackets will reload automatically via useEffect
            }}
          />
        )}

        {!isAuthenticated && !authLoading && (
          <div
            style={{
              padding: "16px",
              backgroundColor: "#fff3cd",
              borderRadius: "12px",
              marginBottom: "24px",
              border: "2px solid #ffc107",
            }}
          >
            <strong>Sign in to sync brackets across devices!</strong> Your custom brackets will be
            saved to the cloud and available on all your devices.
          </div>
        )}

        <div style={{ marginBottom: "24px" }}>
          <button type="button" className="btn" onClick={startNewBracket}>
            + Create New Bracket
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>All Brackets</h2>
          {allBrackets.map((bracket) => (
            <div
              key={bracket.id}
              style={{
                border: "2px solid var(--accent)",
                borderRadius: "12px",
                padding: "16px",
                backgroundColor: "#f6f7f9",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "18px" }}>
                    {bracket.name}
                    {bracket.isBuiltIn && (
                      <span style={{ fontSize: "12px", color: "#666", marginLeft: "8px" }}>
                        {overriddenIds.has(bracket.id) ? "(Built-in - Customized)" : "(Built-in)"}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "14px", color: "#666", marginTop: "4px" }}>
                    Mode: {bracket.mode} | Options: {bracket.options.length}
                    {bracket.mustStart && bracket.mustStart.length > 0 && (
                      <span> | Starts with: {bracket.mustStart.join(", ")}</span>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    className="btn small"
                    onClick={() => startEditBracket(bracket)}
                  >
                    Edit
                  </button>
                  {!bracket.isBuiltIn && (
                    <button
                      type="button"
                      className="btn small"
                      onClick={() => handleDelete(bracket.id)}
                      style={{ backgroundColor: "#dc3545", color: "#fff", borderColor: "#dc3545" }}
                    >
                      Delete
                    </button>
                  )}
                  {bracket.isBuiltIn && (
                    <button
                      type="button"
                      className="btn small"
                      onClick={async () => {
                        if (confirm("Reset this bracket to its original built-in values?")) {
                          // Delete the custom override to restore built-in
                          await deleteCustomBracket(bracket.id);
                          const brackets = await getCustomBrackets();
                          setCustomBrackets(brackets);
                        }
                      }}
                      style={{ backgroundColor: "#6c757d", color: "#fff", borderColor: "#6c757d" }}
                    >
                      Reset to Default
                    </button>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "#666",
                  maxHeight: "100px",
                  overflowY: "auto",
                  padding: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "6px",
                }}
              >
                {bracket.options.slice(0, 10).join(", ")}
                {bracket.options.length > 10 && ` ... (+${bracket.options.length - 10} more)`}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ maxWidth: "800px", padding: "24px" }}>
      <header className="header" style={{ marginBottom: "24px" }}>
        <div className="title">
          Admin Panel {editingBracket ? "- Edit Bracket" : "- New Bracket"}
        </div>
        <div className="spacer" />
        <button
          type="button"
          className="btn small"
          onClick={() => {
            resetForm();
            setStep("list");
          }}
        >
          Cancel
        </button>
      </header>

      <div style={{ marginBottom: "24px" }}>
        <div className="stage">
          <div>
            {step === "mode" && "Step 1: Select Bracket Size"}
            {step === "options" && "Step 2: Enter Options"}
            {step === "confirm" && "Step 3: Confirm Options"}
            {step === "mustStart" && "Step 4: Select Starting Options (Optional)"}
            {step === "name" && "Step 5: Enter Bracket Name"}
          </div>
        </div>
      </div>

      {step === "mode" && (
        <div className="arena" style={{ gap: "16px" }}>
          <button
            type="button"
            className="card"
            onClick={() => handleModeSelect(8)}
            style={{ cursor: "pointer" }}
          >
            Top 8 Bracket
          </button>
          <button
            type="button"
            className="card"
            onClick={() => handleModeSelect(10)}
            style={{ cursor: "pointer" }}
          >
            Top 10 Bracket
          </button>
          <button
            type="button"
            className="card"
            onClick={() => handleModeSelect(12)}
            style={{ cursor: "pointer" }}
          >
            Top 12 Bracket
          </button>
        </div>
      )}

      {step === "options" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ fontWeight: "bold" }}>
            Enter options (one per line). You need at least {mode} options:
          </label>
          <textarea
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            rows={15}
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid var(--accent)",
              borderRadius: "12px",
              fontFamily: "inherit",
              fontSize: "14px",
            }}
            placeholder={`Option 1\nOption 2\nOption 3\n...`}
          />
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (editingBracket) {
                  setStep("list");
                  resetForm();
                } else {
                  setStep("mode");
                }
              }}
            >
              Back
            </button>
            <button type="button" className="btn" onClick={handleOptionsSubmit}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "confirm" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ fontWeight: "bold" }}>
            Confirm your options ({options.length} total):
          </label>
          <div
            style={{
              border: "2px solid var(--accent)",
              borderRadius: "12px",
              padding: "16px",
              maxHeight: "400px",
              overflowY: "auto",
              backgroundColor: "#f6f7f9",
            }}
          >
            {options.map((option, idx) => (
              <div
                key={idx}
                style={{
                  padding: "8px",
                  borderBottom: idx < options.length - 1 ? "1px solid #ddd" : "none",
                }}
              >
                {idx + 1}. {option}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              className="btn"
              onClick={() => setStep("options")}
            >
              Back
            </button>
            <button type="button" className="btn" onClick={handleConfirm}>
              Continue
            </button>
          </div>
        </div>
      )}

      {step === "mustStart" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ fontWeight: "bold" }}>
            Select 1 or 2 options that should always start first (optional - you can skip with 0 selections):
          </label>
          <div
            style={{
              border: "2px solid var(--accent)",
              borderRadius: "12px",
              padding: "16px",
              maxHeight: "400px",
              overflowY: "auto",
              backgroundColor: "#f6f7f9",
            }}
          >
            {options.map((option, idx) => {
              const isSelected = mustStart.includes(option);
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMustStartSelect(option)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginBottom: "8px",
                    border: `2px solid ${isSelected ? "var(--accent)" : "#ccc"}`,
                    borderRadius: "8px",
                    backgroundColor: isSelected ? "var(--accent)" : "#fff",
                    color: isSelected ? "#fff" : "var(--fg)",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: isSelected ? "bold" : "normal",
                  }}
                >
                  {isSelected ? "✓ " : ""}
                  {option}
                </button>
              );
            })}
          </div>
          {mustStart.length > 0 && (
            <div style={{ padding: "12px", backgroundColor: "#e8f5e9", borderRadius: "8px" }}>
              <strong>Selected ({mustStart.length}/2):</strong> {mustStart.join(", ")}
            </div>
          )}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              className="btn"
              onClick={() => setStep("confirm")}
            >
              Back
            </button>
            <button
              type="button"
              className="btn"
              onClick={handleMustStartConfirm}
            >
              {mustStart.length === 0 ? "Skip (No Starting Options)" : "Continue"}
            </button>
          </div>
        </div>
      )}

      {step === "name" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <label style={{ fontWeight: "bold" }}>Enter bracket name:</label>
          <input
            type="text"
            value={bracketName}
            onChange={(e) => setBracketName(e.target.value)}
            placeholder="e.g., Top Movies, Favorite Foods, etc."
            style={{
              width: "100%",
              padding: "12px",
              border: "2px solid var(--accent)",
              borderRadius: "12px",
              fontFamily: "inherit",
              fontSize: "16px",
            }}
          />
          {mustStart.length > 0 && (
            <div style={{ padding: "12px", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
              <strong>Starting options:</strong> {mustStart.join(", ")}
            </div>
          )}
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              type="button"
              className="btn"
              onClick={() => setStep("mustStart")}
            >
              Back
            </button>
            <button type="button" className="btn" onClick={handleSave}>
              {editingBracket ? "Update Bracket" : "Save Bracket"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
