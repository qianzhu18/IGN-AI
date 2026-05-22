import Link from 'next/link'

/**
 * 页面顶部宣传栏
 * @returns
 */
export const Banner = ({ title, description, post }) => {
  const authors = Array.isArray(post?.authors) ? post.authors : []

  return (
    <>
      {/* <!-- ====== Banner Section Start --> */}
      <div className='relative z-10 overflow-hidden pb-[60px] pt-[120px] dark:bg-dark md:pt-[130px] lg:pt-[160px]'>
        <div className='absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-stroke/0 via-stroke to-stroke/0 dark:via-dark-3'></div>
        <div className='container'>
          <div className='flex flex-wrap items-center -mx-4'>
            <div className='w-full px-4'>
              <div className='text-center'>
                <h1 className='mb-4 text-3xl font-bold text-dark dark:text-white sm:text-4xl md:text-[40px] md:leading-[1.2]'>
                  {title}
                </h1>
                <p className='mb-5 text-base text-body-color dark:text-dark-6'>
                  {description}
                </p>
                {(post?.publishDay || authors.length > 0) && (
                  <div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-body-color dark:text-dark-6'>
                    {post?.publishDay && <span>{post.publishDay}</span>}
                    {authors.length > 0 && (
                      <div className='flex flex-wrap items-center justify-center gap-2'>
                        <span>Authors</span>
                        {authors.map(author => (
                          <Link
                            key={author.id || author.slug || author.title}
                            href={author.href || '/members'}
                            className='underline-offset-4 hover:text-dark dark:hover:text-white hover:underline'
                          >
                            {author.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* <ul className="flex items-center justify-center gap-[10px]">
                <li>
                  <a
                    href="index.html"
                    className="flex items-center gap-[10px] text-base font-medium text-dark dark:text-white"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="flex items-center gap-[10px] text-base font-medium text-body-color"
                  >
                    <span className="text-body-color dark:text-dark-6"> / </span>
                    Blog Details
                  </a>
                </li>
              </ul> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <!-- ====== Banner Section End --> */}
    </>
  )
}
