"use client";

export default function ClientMain(
    { children }: { children: React.ReactNode },
) {
    return (
        <main style={{ marginTop: "var(--main-top-offset)" }}>
            {children}
        </main>
    );
}
