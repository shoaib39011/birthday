import { useState, useEffect } from "react";
import { Heart, Gift, Sparkles } from "lucide-react";

type Stage = "welcome" | "balloons" | "message" | "photos";

const balloonColors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-chart-1",
  "bg-chart-2",
  "bg-chart-5",
];

const confettiColors = [
  "bg-primary",
  "bg-secondary",
  "bg-accent",
  "bg-chart-3",
  "bg-chart-5",
];

// Default birthday message - no backend required
const DEFAULT_MESSAGE = `Assalamualikum aasia! Happy birthday to you! I hope you have a great day and a wonderful year ahead. You are a special person and I am lucky to have you in my life. I love you and I hope you have a great day! and hope ypu accept my gift(little effort from my side) keep smiling and keep shining`;

// Photo images - replace these URLs with actual image URLs
// You can use:
// - Direct image URLs from the web
// - Images uploaded to a CDN or image hosting service
// - Images in the public folder (e.g., "/images/photo1.jpg")
// Recommended: Upload images to the public folder and use paths like "/images/photo1.jpg"
const PHOTO_IMAGES = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=500&fit=crop",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=500&fit=crop",
];

// Birthday song - using a simple melody generated with Web Audio API
const playBirthdaySong = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523.25, 523.25, 587.33, 523.25, 698.46, 659.25]; // C, C, D, C, F, E
    const durations = [0.3, 0.1, 0.4, 0.4, 0.4, 0.8];
    let currentTime = audioContext.currentTime;

    notes.forEach((freq, i) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = freq;
      oscillator.type = "sine";
      
      gainNode.gain.setValueAtTime(0.2, currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + durations[i]);
      
      oscillator.start(currentTime);
      oscillator.stop(currentTime + durations[i]);
      
      currentTime += durations[i] + 0.1;
    });
  } catch (error) {
    console.log("Could not play birthday song:", error);
  }
};

// Function to play click sound using Web Audio API
const playClickSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // Fallback: silently fail if audio context is not available
    console.log("Audio not available");
  }
};

export default function BirthdayWish() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [showBalloons, setShowBalloons] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [balloonsComplete, setBalloonsComplete] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hasPlayedSong, setHasPlayedSong] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Play birthday song when balloons appear
  useEffect(() => {
    if (stage === "balloons" && !hasPlayedSong) {
      playBirthdaySong();
      setHasPlayedSong(true);
    }
  }, [stage, hasPlayedSong]);

  const handleClick = () => {
    playClickSound();
    
    if (stage === "welcome") {
      setStage("balloons");
      setShowBalloons(true);
      if (prefersReducedMotion) {
        setBalloonsComplete(true);
      } else {
        setTimeout(() => {
          setBalloonsComplete(true);
        }, 2000);
      }
    } else if (stage === "balloons" && balloonsComplete) {
      setStage("message");
      setShowMessage(true);
    } else if (stage === "message") {
      setStage("photos");
      setShowPhotos(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleClick();
    }
  };

  const customMessage = DEFAULT_MESSAGE;

  return (
    <div
      className="relative h-screen w-full overflow-hidden cursor-pointer focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-4"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      data-testid="birthday-wish-container"
      role="button"
      tabIndex={0}
      aria-label="Click to continue"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />

      {stage === "welcome" && (
        <div className={`relative z-10 flex flex-col items-center justify-center h-full ${!prefersReducedMotion && "animate-fade-in"}`}>
          <h1
            className={`text-8xl md:text-9xl font-display text-primary mb-8 focus:outline-none focus:ring-4 focus:ring-primary rounded-md ${!prefersReducedMotion && "animate-scale-in"}`}
            data-testid="text-welcome"
            tabIndex={0}
          >
            HI
          </h1>
          <Heart
            className={`w-24 h-24 md:w-32 md:h-32 text-primary fill-primary ${!prefersReducedMotion && "animate-heart-beat"}`}
            data-testid="icon-heart"
            aria-label="Heart icon"
          />
          <p
            className={`absolute bottom-12 text-sm md:text-base text-muted-foreground font-body opacity-60 ${!prefersReducedMotion && "animate-fade-in"}`}
            data-testid="text-prompt"
          >
            Click anywhere to continue
          </p>
        </div>
      )}

      {showBalloons && (
        <>
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <h2
              className={`text-7xl md:text-9xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent tracking-wider focus:outline-none focus:ring-4 focus:ring-primary rounded-md ${
                prefersReducedMotion ? "opacity-100" : balloonsComplete ? "opacity-100" : "opacity-0"
              } ${!prefersReducedMotion && "transition-opacity duration-1000"}`}
              style={{
                textShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
              data-testid="text-birthday"
              tabIndex={0}
            >
              HAPPY BIRTHDAY AASIA
            </h2>
          </div>

          {!prefersReducedMotion && Array.from({ length: 15 }).map((_, i) => {
            const delay = i * 150;
            const color = balloonColors[i % balloonColors.length];
            const size = 60 + (i % 3) * 20;
            const leftPosition = 5 + (i * 6.5);
            
            return (
              <div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  left: `${leftPosition}%`,
                  bottom: 0,
                  animationDelay: prefersReducedMotion ? "0ms" : `${delay}ms`,
                }}
                data-testid={`balloon-${i}`}
              >
                <div className="relative animate-balloon-rise">
                  <div
                    className={`${color} rounded-full shadow-lg`}
                    style={{
                      width: `${size}px`,
                      height: `${size * 1.15}px`,
                      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                    }}
                  />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-0.5 bg-foreground/20"
                    style={{ height: "80px", top: `${size * 1.15}px` }}
                  />
                  <div
                    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-foreground/30"
                    style={{ top: `${size * 1.15 + 80}px` }}
                  />
                </div>
              </div>
            );
          })}

          {balloonsComplete && (
            <p
              className={`absolute bottom-12 left-1/2 -translate-x-1/2 text-sm md:text-base text-foreground font-body z-30 ${!prefersReducedMotion && "animate-fade-in"}`}
              data-testid="text-prompt-continue"
            >
              Click to see your special message
            </p>
          )}
        </>
      )}

      {showMessage && (
        <div className={`absolute inset-0 z-40 flex items-center justify-center p-6 md:p-12 ${!prefersReducedMotion && "animate-fade-in"}`}>
          <div className="relative max-w-2xl w-full">
            <div
              className={`bg-card/95 backdrop-blur-xl rounded-lg p-8 md:p-12 shadow-2xl border border-card-border ${!prefersReducedMotion && "animate-scale-in"}`}
              data-testid="message-card"
            >
              <div className="flex items-center justify-center mb-8">
                <Sparkles className={`w-8 h-8 text-accent ${!prefersReducedMotion && "animate-pulse"}`} aria-hidden="true" />
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-primary mx-4 focus:outline-none focus:ring-4 focus:ring-primary rounded-md" tabIndex={0}>
                  For You
                </h3>
                <Sparkles className={`w-8 h-8 text-accent ${!prefersReducedMotion && "animate-pulse"}`} aria-hidden="true" />
              </div>
              
              <p
                className="text-lg md:text-xl font-body leading-relaxed text-card-foreground text-center"
                data-testid="text-custom-message"
              >
                {customMessage}
              </p>

              <div className="flex items-center justify-center gap-4 mt-8">
                <Heart className={`w-6 h-6 text-primary fill-primary ${!prefersReducedMotion && "animate-heart-beat"}`} />
                <Heart className={`w-8 h-8 text-secondary fill-secondary ${!prefersReducedMotion && "animate-heart-beat"}`} style={{ animationDelay: "0.2s" }} />
                <Heart className={`w-6 h-6 text-primary fill-primary ${!prefersReducedMotion && "animate-heart-beat"}`} style={{ animationDelay: "0.4s" }} />
              </div>
            </div>

            {!prefersReducedMotion && Array.from({ length: 7 }).map((_, i) => {
              const positions = [
                { top: "10%", left: "5%" },
                { top: "20%", right: "8%" },
                { top: "50%", left: "2%" },
                { top: "60%", right: "5%" },
                { bottom: "15%", left: "10%" },
                { bottom: "25%", right: "12%" },
                { top: "35%", left: "15%" },
              ];
              const delays = [0, 0.3, 0.6, 0.9, 1.2, 1.5, 1.8];
              
              return (
                <Gift
                  key={`gift-${i}`}
                  className="absolute text-primary animate-float-gentle"
                  style={{
                    ...positions[i],
                    width: "40px",
                    height: "40px",
                    animationDelay: `${delays[i]}s`,
                  }}
                  data-testid={`gift-${i}`}
                />
              );
            })}

            {!prefersReducedMotion && Array.from({ length: 8 }).map((_, i) => {
              const positions = [
                { top: "15%", left: "90%" },
                { top: "25%", left: "85%" },
                { top: "45%", right: "88%" },
                { top: "55%", left: "92%" },
                { bottom: "20%", right: "85%" },
                { bottom: "30%", left: "87%" },
                { top: "70%", left: "5%" },
                { top: "40%", right: "2%" },
              ];
              const delays = [0.2, 0.5, 0.8, 1.1, 1.4, 1.7, 2.0, 2.3];
              
              return (
                <div
                  key={`chocolate-${i}`}
                  className="absolute w-8 h-8 rounded-md bg-gradient-to-br from-accent to-chart-5 shadow-lg animate-float-bounce"
                  style={{
                    ...positions[i],
                    animationDelay: `${delays[i]}s`,
                  }}
                  data-testid={`chocolate-${i}`}
                />
              );
            })}

            {!prefersReducedMotion && Array.from({ length: 30 }).map((_, i) => {
              const color = confettiColors[i % confettiColors.length];
              const leftPosition = Math.random() * 100;
              const delay = Math.random() * 2;
              const duration = 3 + Math.random() * 2;
              
              return (
                <div
                  key={`confetti-${i}`}
                  className={`absolute w-2 h-3 ${color} opacity-80`}
                  style={{
                    left: `${leftPosition}%`,
                    top: "-10%",
                    animation: `confetti-fall ${duration}s linear ${delay}s infinite`,
                  }}
                  data-testid={`confetti-${i}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {showPhotos && (
        <div className={`absolute inset-0 z-50 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 ${!prefersReducedMotion && "animate-fade-in"}`}>
          <div className="relative max-w-6xl w-full">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-center text-primary mb-8">
              Beautiful Memories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {PHOTO_IMAGES.map((imageUrl, index) => (
                <div
                  key={index}
                  className={`relative ${!prefersReducedMotion && "animate-scale-in"}`}
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                >
                  {/* Photo Frame */}
                  <div className="relative bg-white p-4 md:p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                    {/* White sheet/mat */}
                    <div className="bg-white p-3 md:p-4 shadow-inner">
                      {/* Photo */}
                      <div className="relative overflow-hidden bg-gray-200 aspect-[3/4]">
                        <img
                          src={imageUrl}
                          alt={`Memory ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback if image fails to load
                            (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23f3f4f6' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EPhoto ${index + 1}%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                        {/* Decorative corner */}
                        <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary/30" />
                        <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary/30" />
                        <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary/30" />
                        <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary/30" />
                      </div>
                    </div>
                    {/* Frame shadow effect */}
                    <div className="absolute inset-0 border-4 border-primary/20 pointer-events-none" />
                  </div>
                  {/* Sparkle effect */}
                  {!prefersReducedMotion && (
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-accent animate-pulse" style={{ animationDelay: `${index * 0.3}s` }} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-8 text-lg font-body animate-pulse">
              💖 Happy Birthday Aasia! 💖
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
