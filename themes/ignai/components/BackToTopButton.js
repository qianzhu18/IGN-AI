import throttle from 'lodash.throttle'
import { useCallback, useEffect } from 'react'

/**
 * 回顶按钮
 * @returns
 */
export const BackToTopButton = () => {
  useEffect(() => {
    Math.easeInOutQuad = function (t, b, c, d) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    window.addEventListener('scroll', navBarScollListener)
    return () => {
      window.removeEventListener('scroll', navBarScollListener)
    }
  }, [])

  // 滚动监听
  const throttleMs = 200
  const navBarScollListener = useCallback(
    throttle(() => {
      const scrollY = window.scrollY
      // 显示或隐藏返回顶部按钮
      const backToTop = document.querySelector('.back-to-top')
      if (backToTop) {
        backToTop.style.display = scrollY > 50 ? 'flex' : 'none'
      }
    }, throttleMs)
  )

  // ====== scroll top js
  function scrollTo(element, to = 0, duration = 500) {
    const start = element.scrollTop
    const change = to - start
    const increment = 20
    let currentTime = 0

    const animateScroll = () => {
      currentTime += increment

      const val = Math.easeInOutQuad(currentTime, start, change, duration)

      element.scrollTop = val

      if (currentTime < duration) {
        setTimeout(animateScroll, increment)
      }
    }

    animateScroll()
  }

  function scrollTop() {
    if (document) {
      scrollTo(document.documentElement)
    }
  }

  return (
    <>
      {/* <!-- ====== Back To Top Start --> */}
      <button
        type='button'
        aria-label='回到顶部'
        onClick={scrollTop}
        className='back-to-top ignai-back-to-top fixed bottom-16 left-auto right-8 z-[999] hidden h-11 w-11 items-center justify-center rounded-2xl text-white transition duration-300 ease-in-out'
        style={{
          border: '1px solid rgba(255, 183, 121, 0.2)',
          background: 'linear-gradient(135deg, rgba(255,122,24,0.96), rgba(255,154,60,0.9))',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 18px 36px rgba(255,122,24,0.22)'
        }}>
        <span className='mt-[6px] h-3 w-3 rotate-45 border-l border-t border-white'></span>
      </button>
      {/* <!-- ====== Back To Top End --> */}
    </>
  )
}
