import React from "react";

interface DotPatternProps {
    color?: string; // Optional color prop for dots
    rows?: number; // Number of rows
    cols?: number; // Number of columns
    startLocation?: "top" | "bottom" | "left" | "right"; // Direction of the effect
    width?: string; // Custom width for the grid (e.g., "100vw")
    height?: string; // Custom height for the grid (e.g., "100vh")
}

export function DotPattern({
                               color = "black",
                               rows = 10,
                               cols = 10,
                               startLocation = "top", // Default direction is top-to-bottom
                               width = "100vw", // Default width
                               height = "100vh", // Default height
                           }: DotPatternProps) {
    // Calculate the size of each circle dynamically based on rows and cols
    const containerWidth = parseInt(width.endsWith("vw") ? width.replace("vw", "") : "100", 10);
    const containerHeight = parseInt(height.endsWith("vh") ? height.replace("vh", "") : "100", 10);
    const circleWidth = `${containerWidth / cols}vw`; // Circle width based on cols
    const circleHeight = `${containerHeight / rows}vh`; // Circle height based on rows

    // Generate rows and columns
    const rowArray = Array.from({ length: rows });
    const colArray = Array.from({ length: cols });

    return (
        <div
            className="absolute top-0 left-0 overflow-hidden pointer-events-none"
            style={{
                width,
                height,
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${circleWidth})`, // Dynamically sized columns
                gridTemplateRows: `repeat(${rows}, ${circleHeight})`, // Dynamically sized rows
            }}
        >
            {rowArray.map((_, rowIndex) =>
                colArray.map((_, colIndex) => {
                    // Calculate opacity based on start location
                    let fadeFactor = 0;

                    switch (startLocation) {
                        case "top":
                            fadeFactor = rowIndex / rows;
                            break;
                        case "bottom":
                            fadeFactor = (rows - rowIndex - 1) / rows;
                            break;
                        case "left":
                            fadeFactor = colIndex / cols;
                            break;
                        case "right":
                            fadeFactor = (cols - colIndex - 1) / cols;
                            break;
                    }

                    return (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className="rounded-full"
                            style={{
                                backgroundColor: color,
                                width: "100%", // Fill the allocated grid cell
                                height: "100%", // Fill the allocated grid cell
                                opacity: 1 - fadeFactor, // Fade based on position
                            }}
                        />
                    );
                })
            )}
        </div>
    );
}