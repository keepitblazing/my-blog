import { ImageResponse } from "next/og";
import Image from "next/image";

export const runtime = "edge";

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000000",
            backgroundImage:
              "linear-gradient(to bottom right, #000000, #1a1a1d)",
          }}
        >
          {/* Profile Section */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
              marginBottom: "40px",
            }}
          >
            <div className="w-32 h-32 rounded-full border-2 border-blog-grey">
              <Image
                src="https://avatars.githubusercontent.com/u/103014298?s=400&u=0381c49a20226f7f21aae12fe073a7faee078a46&v=4"
                alt="Profile"
                width={150}
                height={150}
                style={{
                  borderRadius: "50%",
                  border: "4px solid #222225",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <h1
                style={{
                  fontSize: "60px",
                  fontWeight: "bold",
                  color: "#e5e5e7",
                  margin: 0,
                  marginBottom: "10px",
                }}
              >
                박지민
              </h1>
              <p
                style={{
                  fontSize: "32px",
                  color: "#999",
                  margin: 0,
                }}
              >
                Frontend Developer
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "15px",
              justifyContent: "center",
              maxWidth: "800px",
              marginBottom: "40px",
            }}
          >
            {["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js"].map(
              (skill) => (
                <div
                  key={skill}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#222225",
                    color: "#e5e5e7",
                    borderRadius: "8px",
                    fontSize: "20px",
                    border: "1px solid #333",
                  }}
                >
                  {skill}
                </div>
              )
            )}
          </div>

          {/* Projects Count */}
          <div
            style={{
              display: "flex",
              gap: "40px",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  color: "#e5e5e7",
                  fontWeight: "bold",
                }}
              >
                10+
              </span>
              <span style={{ fontSize: "18px", color: "#999" }}>Projects</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "36px",
                  color: "#e5e5e7",
                  fontWeight: "bold",
                }}
              >
                Open Source
              </span>
              <span style={{ fontSize: "18px", color: "#999" }}>
                Contributor
              </span>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: "30px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span style={{ fontSize: "24px", color: "#e5e5e7" }}>
              Keep it blazing
            </span>
            <span style={{ fontSize: "28px" }}>🔥</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
