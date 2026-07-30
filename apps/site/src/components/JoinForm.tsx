'use client'

import { FormEvent, useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export function JoinForm() {
  const [state, setState] = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setState('submitting')
    setMessage('')
    const form = new FormData(event.currentTarget)
    const payload = Object.fromEntries(form.entries())

    try {
      const response = await fetch('/api/join', {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const result = (await response.json()) as { message?: string }
      if (!response.ok) throw new Error(result.message || '提交失败，请稍后重试。')
      event.currentTarget.reset()
      setMessage(result.message || '已收到。我们会在后台跟进这份申请。')
      setState('success')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : '提交失败，请稍后重试。')
      setState('error')
    }
  }

  return (
    <form className="join-form" onSubmit={submit}>
      <div className="join-form__grid">
        <label>
          姓名
          <input autoComplete="name" maxLength={80} name="name" required />
        </label>
        <label>
          联系方式
          <input maxLength={180} name="contact" placeholder="微信 / 邮箱 / 手机号" required />
        </label>
      </div>
      <label>
        你正在做什么
        <input maxLength={160} name="role" placeholder="学生、创作者、研究者、开发者……" required />
      </label>
      <label>
        感兴趣的方向
        <input maxLength={300} name="interests" placeholder="例如：AI 产品、Agent、开源、设计、教育（用逗号分隔）" />
      </label>
      <label>
        想和我们一起做什么
        <textarea maxLength={2000} name="message" required rows={6} />
      </label>
      <label className="join-form__trap" aria-hidden="true">
        公司
        <input autoComplete="off" name="company" tabIndex={-1} />
      </label>
      <button className="primary-action" disabled={state === 'submitting'} type="submit">
        {state === 'submitting' ? '正在提交…' : '提交申请'} <span aria-hidden="true">↗</span>
      </button>
      {message ? <p aria-live="polite" className={`form-message is-${state}`}>{message}</p> : null}
    </form>
  )
}
