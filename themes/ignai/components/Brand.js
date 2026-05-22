/**
 * IGNAI Brand — 横向滚动品牌词
 * 社区角色关键词滚动展示
 */
import { useEffect, useRef } from 'react'
import CONFIG from '../config'

export const Brand = () => {
  const brands = CONFIG.IGNAI_BRANDS || []
  const scrollContainerRef = useRef(null)

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    let scrollAmount = 0
    const scrollSpeed = 0.8

    const scroll = () => {
      if (scrollContainer) {
        scrollAmount += scrollSpeed
        scrollContainer.scrollLeft = scrollAmount
        if (scrollAmount >= scrollContainer.scrollWidth / 2) {
          scrollAmount = 0
        }
      }
      requestAnimationFrame(scroll)
    }

    scroll()
    return () => cancelAnimationFrame(scroll)
  }, [])

  return (
    <section id='brand' className='py-8'>
      <div
        className='ignai-brand-scroll overflow-hidden whitespace-nowrap container mx-auto p-4 rounded-2xl'
        ref={scrollContainerRef}>
        <div className='inline-block'>
          {brands?.map((item, index) => (
            <span key={index} className='mx-6 text-base font-medium text-white/40 hover:text-[#FF7A18] transition'>
              {item}
            </span>
          ))}
          {brands?.map((item, index) => (
            <span key={`clone-${index}`} className='mx-6 text-base font-medium text-white/40'>
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
