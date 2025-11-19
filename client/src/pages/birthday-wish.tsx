import { useState, useEffect } from "react";
import { Heart, Gift, Sparkles } from "lucide-react";

type Stage = "welcome" | "intro" | "balloons" | "message" | "photos" | "final" | "outro";

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
const DEFAULT_MESSAGE = `Assalamualikum aasia! Happy birthday to you! I hope you have a great day and a wonderful year ahead. You are a special person and I am lucky to have you in my life. I love you and I hope you have a great day! and hope you accept my gift(little effort from my side)`;

// Photo images - Use direct paths since images are in public root
// Vite copies public folder contents to dist root
const PHOTO_IMAGES = [
  "/photo1.jpg",
  "/photo2.jpg",
  "/photo3.jpg",
];

// Preload images to prevent flickering
const preloadImages = () => {
  PHOTO_IMAGES.forEach((src) => {
    const img = new Image();
    img.src = src;
  });
};

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

// Function to play photo drop sound
const playPhotoDropSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 400;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log("Audio not available");
  }
};

export default function BirthdayWish() {
  const [stage, setStage] = useState<Stage>("welcome");
  const [showIntro, setShowIntro] = useState(false);
  const [showBalloons, setShowBalloons] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [showOutro, setShowOutro] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
  const [introText, setIntroText] = useState("");
  const [outroText, setOutroText] = useState("");
  const [outroSubtext, setOutroSubtext] = useState("");
  const [outroFinal, setOutroFinal] = useState("");
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

  // Handle photo falling animation
  useEffect(() => {
    if (stage === "photos") {
      if (visiblePhotos.length < PHOTO_IMAGES.length) {
        const timer = setTimeout(() => {
          const nextIndex = visiblePhotos.length;
          setVisiblePhotos([...visiblePhotos, nextIndex]);
          playPhotoDropSound();
        }, visiblePhotos.length === 0 ? 300 : 500 + (visiblePhotos.length * 400));
        
        return () => clearTimeout(timer);
      }
    }
  }, [stage, visiblePhotos]);

  // Preload images on component mount to prevent flickering
  useEffect(() => {
    preloadImages();
  }, []);

  // Reset visible photos when entering photos stage
  useEffect(() => {
    if (stage === "photos") {
      setVisiblePhotos([]);
      setLoadedImages(new Set());
    }
  }, [stage]);

  // Typing effect for outro
  const typeOutroText = () => {
    const text1 = "A small effort by";
    const text2 = "~stupid";
    const text3 = "Fi-amanillah";
    let index1 = 0;
    let index2 = 0;
    let index3 = 0;
    
    const typeInterval1 = setInterval(() => {
      if (index1 < text1.length) {
        setOutroText(text1.slice(0, index1 + 1));
        index1++;
      } else {
        clearInterval(typeInterval1);
        // Wait a bit before starting second line
        setTimeout(() => {
          const typeInterval2 = setInterval(() => {
            if (index2 < text2.length) {
              setOutroSubtext(text2.slice(0, index2 + 1));
              index2++;
            } else {
              clearInterval(typeInterval2);
              // Wait before starting third line
              setTimeout(() => {
                const typeInterval3 = setInterval(() => {
                  if (index3 < text3.length) {
                    setOutroFinal(text3.slice(0, index3 + 1));
                    index3++;
                  } else {
                    clearInterval(typeInterval3);
                  }
                }, 150);
              }, 800);
            }
          }, 100);
        }, 500);
      }
    }, 100);
  };

  // Typing effect for intro
  useEffect(() => {
    if (stage === "intro") {
      const text = "it's 28 NOV 2025 and you have turned 18 so..... so wishing you a ";
      let index = 0;
      setIntroText("");
      
      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setIntroText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          // Auto-advance to balloons after typing completes
          setTimeout(() => {
            setShowIntro(false); // Hide intro before showing balloons
            setStage("balloons");
            setShowBalloons(true);
            if (prefersReducedMotion) {
              setBalloonsComplete(true);
            } else {
              setTimeout(() => {
                setBalloonsComplete(true);
              }, 2000);
            }
          }, 800);
        }
      }, 80);
      
      return () => clearInterval(typeInterval);
    }
  }, [stage, prefersReducedMotion]);

  const handleClick = () => {
    playClickSound();
    
    if (stage === "welcome") {
      setStage("intro");
      setShowIntro(true);
    } else if (stage === "intro") {
      // Skip typing and go to balloons
      setShowIntro(false); // Hide intro before showing balloons
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
    } else if (stage === "photos") {
      setStage("final");
      setShowFinal(true);
    } else if (stage === "final") {
      setStage("outro");
      setShowOutro(true);
      // Start typing outro
      typeOutroText();
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

      {showIntro && stage === "intro" && (
        <div className={`absolute inset-0 z-30 flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 ${!prefersReducedMotion && "animate-fade-in"}`}>
          <div className="relative max-w-4xl w-full text-center">
            <p className="text-2xl md:text-4xl lg:text-5xl font-mono text-foreground leading-relaxed tracking-wider">
              {introText}
              {introText.length > 0 && introText.length < "it's 28 NOV 2025 and you have turned 18 so..... so wishing you a ".length && (
                <span className="animate-pulse ml-1">|</span>
              )}
            </p>
            {introText.length === "it's 28 NOV 2025 and you have turned 18 so..... so wishing you a ".length && (
              <p className="text-sm md:text-base text-muted-foreground mt-4 font-body opacity-60">
                Click to skip...
              </p>
            )}
          </div>
        </div>
      )}

      {showBalloons && (
        <>
          <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
            <div className="w-full flex justify-center">
              <h2
                className={`text-7xl md:text-9xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent tracking-wider text-center focus:outline-none focus:ring-4 focus:ring-primary rounded-md ${
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
              className={`bg-card/95 backdrop-blur-xl rounded-lg p-8 md:p-12 shadow-2xl border border-card-border ${!prefersReducedMotion && "animate-mosaic-reveal"}`}
              style={!prefersReducedMotion ? {
                animationDelay: '0.3s',
              } : {}}
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
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 relative">
              {PHOTO_IMAGES.map((imageUrl, index) => {
                // Special handling for photo3 - crop top and bottom
                const isPhoto3 = index === 2;
                const isVisible = visiblePhotos.includes(index);
                // Album tilt effect - center photo straight, side photos slightly tilted
                const tiltAngle = index === 0 ? -8 : index === 2 ? 8 : 0;
                const yOffset = index === 0 ? -5 : index === 2 ? -5 : 0;
                
                return (
                  <div
                    key={index}
                    className="relative"
                    style={{
                      // Tilt persists - applied to outer wrapper
                      transform: isVisible ? `rotate(${tiltAngle}deg) translateY(${yOffset}px)` : 'none',
                      transformOrigin: 'center center',
                      width: '100%',
                      maxWidth: '280px', // Ensure all photos same max width
                      flexShrink: 0,
                      opacity: isVisible ? 1 : 0,
                      transition: 'opacity 0.3s ease-in',
                    }}
                  >
                    {/* Inner wrapper for animation */}
                    <div
                      className={`relative ${isVisible && !prefersReducedMotion ? "animate-photo-fall" : ""}`}
                      style={{
                        animationDelay: isVisible ? `${index * 0.4}s` : "0s",
                      }}
                    >
                      {/* Photo Frame */}
                      <div className="relative bg-white p-4 md:p-6 shadow-2xl transform hover:scale-105 transition-transform duration-300 w-full">
                      {/* White sheet/mat */}
                      <div className="bg-white p-3 md:p-4 shadow-inner">
                        {/* Photo - same aspect ratio for all photos */}
                        <div className="relative overflow-hidden bg-gray-200 aspect-[3/4] w-full">
                          <div className="w-full h-full">
                            <img
                              src={imageUrl}
                              alt={`Memory ${index + 1}`}
                              className="w-full h-full object-cover object-center"
                              loading="eager"
                              decoding="async"
                              style={{
                                opacity: loadedImages.has(index) ? 1 : (isVisible ? 0.3 : 0),
                                transition: 'opacity 0.5s ease-in',
                                ...(isPhoto3 ? {
                                  objectPosition: 'center 30%', // Crop top/bottom for photo3
                                  objectFit: 'cover',
                                } : {
                                  objectPosition: 'center center',
                                })
                              }}
                              onError={(e) => {
                                console.error(`Failed to load image: ${imageUrl}`);
                                // Try alternative paths
                                const altPaths = [
                                  `/images/photo${index + 1}.jpg`,  // Try /images/ folder
                                  `./photo${index + 1}.jpg`,  // Relative path
                                ];
                                let altIndex = 0;
                                const tryNext = () => {
                                  if (altIndex < altPaths.length) {
                                    console.log(`Trying path: ${altPaths[altIndex]}`);
                                    (e.target as HTMLImageElement).src = altPaths[altIndex];
                                    altIndex++;
                                  } else {
                                    console.error(`All paths failed for photo ${index + 1}`);
                                    // Final fallback placeholder
                                    (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500'%3E%3Crect fill='%23f3f4f6' width='400' height='500'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EPhoto ${index + 1}%3C/text%3E%3C/svg%3E`;
                                  }
                                };
                                setTimeout(tryNext, 200);
                              }}
                              onLoad={(e) => {
                                // Mark image as loaded to prevent flickering
                                setLoadedImages(prev => new Set(prev).add(index));
                                console.log(`✓ Successfully loaded image: ${imageUrl}`);
                              }}
                            />
                          </div>
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
                  </div>
                );
              })}
            </div>
            <p className="text-center text-muted-foreground mt-6 text-base md:text-lg font-body italic opacity-70">
              i didn't have any good pics 😅😅😅
            </p>
            <p className="text-center text-muted-foreground mt-4 text-sm md:text-base font-body animate-pulse">
              Click to continue...
            </p>
          </div>
        </div>
      )}

      {showFinal && (
        <div className={`absolute inset-0 z-[70] flex items-center justify-center p-6 md:p-12 ${!prefersReducedMotion && "animate-fade-in"}`}>
          {/* Aromatic background with soft gradient and floral elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50/90 via-pink-50/90 to-purple-50/90 backdrop-blur-sm" />
          
          {/* Floating petals/flowers effect */}
          {!prefersReducedMotion && Array.from({ length: 12 }).map((_, i) => {
            const positions = [
              { top: "10%", left: "5%", rotate: "15deg" },
              { top: "20%", right: "8%", rotate: "-20deg" },
              { top: "35%", left: "3%", rotate: "25deg" },
              { top: "45%", right: "5%", rotate: "-15deg" },
              { bottom: "20%", left: "7%", rotate: "30deg" },
              { bottom: "30%", right: "10%", rotate: "-25deg" },
              { top: "60%", left: "2%", rotate: "20deg" },
              { top: "70%", right: "3%", rotate: "-18deg" },
              { bottom: "10%", left: "12%", rotate: "22deg" },
              { bottom: "40%", right: "7%", rotate: "-28deg" },
              { top: "15%", left: "50%", rotate: "18deg" },
              { bottom: "15%", right: "50%", rotate: "-22deg" },
            ];
            const delays = [0, 0.5, 1, 1.5, 2, 2.5, 0.3, 0.8, 1.3, 1.8, 2.3, 0.6];
            
            return (
              <div
                key={`petal-${i}`}
                className="absolute text-rose-300/40 animate-float-gentle pointer-events-none"
                style={{
                  ...positions[i],
                  fontSize: "2rem",
                  animationDelay: `${delays[i]}s`,
                  transform: `rotate(${positions[i].rotate})`,
                }}
              >
                ✿
              </div>
            );
          })}

          {/* Main message card */}
          <div className="relative max-w-3xl w-full z-10">
            <div className={`bg-white/95 backdrop-blur-xl rounded-2xl p-8 md:p-12 shadow-2xl border-2 border-rose-200/50 ${!prefersReducedMotion && "animate-scale-in"}`}>
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 rounded-t-2xl" />
              
              {/* Sparkle decorations */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Sparkles className="w-12 h-12 text-rose-400 animate-pulse" />
              </div>
              
              {/* Main message */}
              <div className="text-center space-y-6 mt-4">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-heart-beat" />
                  <Heart className="w-10 h-10 text-pink-500 fill-pink-500 animate-heart-beat" style={{ animationDelay: "0.2s" }} />
                  <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-heart-beat" style={{ animationDelay: "0.4s" }} />
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  Keep smiling,
                </h2>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                  keep shining,
                </h2>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-semibold text-rose-700 mt-4 leading-tight">
                  I'm always there for you!
                </h2>
                
                {/* Hope-giving sub-message */}
                <p className="text-lg md:text-xl text-rose-600/80 font-body mt-8 italic leading-relaxed">
                  "Every day is a new beginning. You have the strength to overcome any challenge, 
                  and the beauty to light up any room. Remember, you are loved, you are valued, 
                  and you are never alone. Keep moving forward with hope in your heart."
                </p>
                
                {/* Bottom decorative hearts */}
                <div className="flex items-center justify-center gap-4 mt-8">
                  <Heart className="w-6 h-6 text-rose-400 fill-rose-400 animate-heart-beat" />
                  <Heart className="w-8 h-8 text-pink-400 fill-pink-400 animate-heart-beat" style={{ animationDelay: "0.3s" }} />
                  <Heart className="w-6 h-6 text-purple-400 fill-purple-400 animate-heart-beat" style={{ animationDelay: "0.6s" }} />
                </div>
              </div>
            </div>
            
            {/* Floating sparkles around the card */}
            {!prefersReducedMotion && Array.from({ length: 8 }).map((_, i) => {
              const positions = [
                { top: "-10%", left: "10%" },
                { top: "-5%", right: "15%" },
                { bottom: "-10%", left: "20%" },
                { bottom: "-5%", right: "10%" },
                { top: "20%", left: "-5%" },
                { top: "30%", right: "-8%" },
                { bottom: "25%", left: "-3%" },
                { bottom: "35%", right: "-5%" },
              ];
              
              return (
                <Sparkles
                  key={`sparkle-${i}`}
                  className="absolute text-rose-300/60 animate-pulse"
                  style={{
                    ...positions[i],
                    width: "24px",
                    height: "24px",
                    animationDelay: `${i * 0.4}s`,
                  }}
                />
              );
            })}
          </div>
        </div>
      )}

      {showOutro && (
        <div className={`absolute inset-0 z-[80] flex items-center justify-center p-6 md:p-12 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 ${!prefersReducedMotion && "animate-fade-in"}`}>
          <div className="relative max-w-2xl w-full text-center">
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <p className="text-2xl md:text-3xl font-body text-white/90 mb-4 min-h-[2rem]">
                {outroText}
                {outroText.length > 0 && !outroText.endsWith(" ") && outroText.length < "A small effort by".length && (
                  <span className="animate-pulse">|</span>
                )}
              </p>
              <p className="text-xl md:text-2xl font-heading font-semibold text-rose-300/90 mb-4 min-h-[2rem]">
                {outroSubtext}
                {outroSubtext.length > 0 && outroSubtext.length < "~stupid".length && (
                  <span className="animate-pulse">|</span>
                )}
              </p>
              <p className="text-2xl md:text-3xl font-heading font-bold text-amber-300/90 min-h-[2.5rem] mt-6">
                {outroFinal}
                {outroFinal.length > 0 && outroFinal.length < "Fi-amanillah".length && (
                  <span className="animate-pulse">|</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
