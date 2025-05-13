import React, { useEffect, useRef, useState } from 'react'
import { highlightsSlides } from '../../constants'
import { pauseImg, playImg, replayImg } from '../../utils'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

export const MyVideoCarousel = () => {
  const sliderRef = useRef(null)
  const videoRefs = useRef([])
  const progressDivRefs = useRef([])
  const progressRefs = useRef([])

  const [loadedData, setLoadedData] = useState([])
  const [isInViewPort, setIsInViewPort] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0) //current slide
  const [isPlayingVideo, setIsPlayingVideo] = useState(false)
  const [isLastVideo, setIsLastVideo] = useState(false)

  const isBlockVideoAndProgress =
    loadedData.length < highlightsSlides.length || !isInViewPort || isLastVideo

  const playCurrentVideo = () => {
    const currentVideo = videoRefs.current[currentIndex]
    if (currentVideo) {
      currentVideo.play()
      setIsPlayingVideo(true)
    }
  }

  const pauseCurrentVideo = () => {
    const currentVideo = videoRefs.current[currentIndex]
    if (currentVideo) {
      currentVideo.pause()
      setIsPlayingVideo(false)
    }
  }

  const handleVideoEnd = () => {
    // Reset UI progress
    const span = progressRefs.current[currentIndex]
    const dot = progressDivRefs.current[currentIndex]

    if (span && dot) {
      gsap.to(span, {
        width: '0%',
        backgroundColor: '#afafaf',
        duration: 0.3,
        ease: 'power2.out',
      })

      gsap.to(dot, {
        width: '12px',
        duration: 0.4,
        ease: 'power2.out',
      })
    }

    // change slide or end
    if (currentIndex < highlightsSlides.length - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setIsLastVideo(true)
      setIsPlayingVideo(false)
    }
  }

  const handleTogglePlay = () => {
    if (isLastVideo) {
      setCurrentIndex(0)
      setIsLastVideo(false)
      setIsPlayingVideo(true)
    } else {
      isPlayingVideo ? pauseCurrentVideo() : playCurrentVideo()
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInViewPort(entry.isIntersecting)
          if (
            entry.isIntersecting &&
            loadedData.length === highlightsSlides.length &&
            !isLastVideo
          ) {
            setIsPlayingVideo(true)
          } else {
            setIsInViewPort(false)
            pauseCurrentVideo()
          }
        })
      },
      { threshold: 0.5 },
    )

    if (sliderRef.current) {
      observer.observe(sliderRef.current)
    }

    return () => observer.disconnect()
  }, [loadedData, isLastVideo])

  useGSAP(() => {
    if (loadedData.length < highlightsSlides.length || !isInViewPort) return

    const slides = sliderRef.current?.children
    const video = videoRefs.current[currentIndex]
    if (!sliderRef.current || !sliderRef.current.children) return

    Array.from(slides).forEach((slide) => {
      gsap.to(slide, {
        xPercent: -100 * currentIndex,
        duration: 2,
        ease: 'power2.inOut',
        //onComplete: ()=>{}
      })
    })

    if (video && isPlayingVideo) {
      video.play()
    }
  }, [currentIndex, isInViewPort, isPlayingVideo, loadedData.length])

  useEffect(() => {
    if (isBlockVideoAndProgress) return

    const span = progressRefs.current[currentIndex]
    const dot = progressDivRefs.current[currentIndex]
    const video = videoRefs.current[currentIndex]

    if (!span || !dot || !video) return

    const duration = video.duration || highlightsSlides[currentIndex].videoDuration

    const updateProgress = () => {
      if (!video || video.ended) return

      const percentProgress = (video.currentTime / duration) * 100

      gsap.to(dot, {
        width: window.innerWidth < 1200 ? '10vw' : '4vw',
        duration: 0.4,
        ease: 'power2.out',
      })

      gsap.set(span, {
        width: `${percentProgress}%`,
        backgroundColor: 'white',
      })
    }

    if (isPlayingVideo) {
      gsap.ticker.add(updateProgress)
    } else {
      gsap.ticker.remove(updateProgress)
    }

    return () => {
      gsap.ticker.remove(updateProgress)
    }
  }, [currentIndex, isPlayingVideo, isBlockVideoAndProgress])

  return (
    <>
      <div id="slider" ref={sliderRef} className="flex items-center">
        {highlightsSlides.map((item, i) => (
          <div key={item.id} className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${item.id === highlightsSlides[2].videoId && 'translate-x-44'} pointer-events-none`}
                  ref={(el) => (videoRefs.current[i] = el)}
                  onLoadedMetadata={(e) => {
                    setLoadedData((prev) => {
                      if (!prev.includes(e)) {
                        return [...prev, e]
                      }
                      return prev
                    })
                  }}
                  onEnded={handleVideoEnd}
                >
                  <source src={item.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {item.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {highlightsSlides.map((_, i) => (
            <div
              key={i}
              ref={(el) => (progressDivRefs.current[i] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => (progressRefs.current[i] = el)}
              />
            </div>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlayingVideo ? playImg : pauseImg}
            alt={isLastVideo ? 'replay' : !isPlayingVideo ? 'play' : 'pause'}
            onClick={handleTogglePlay}
          />
        </button>
      </div>
    </>
  )
}
