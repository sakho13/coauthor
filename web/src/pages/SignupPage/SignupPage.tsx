import { useEffect, useRef } from 'react'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  FieldError,
  Submit,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const SignupPage = () => {
  const { isAuthenticated, signUp } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.myBookshelf())
    }
  }, [isAuthenticated])

  // focus on username box on page load
  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const passwordRef = useRef<HTMLInputElement>(null)
  const passwordConfirmRef = useRef<HTMLInputElement>(null)

  const onSubmit = async (
    data: Record<'username' | 'password' | 'password-confirm', string>
  ) => {
    if (data.password !== data['password-confirm']) {
      toast.error('パスワードが一致しません')
      return
    }

    const response = await signUp({
      username: data.username,
      password: data.password,
    })

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      if (typeof response.error === 'string') {
        if (response.error.includes('already in use')) {
          toast.error(`既に登録されているメールアドレスです ${data.username}`)
        }
        return
      }
      toast.error('現在新規登録できません 問い合わせください🙏')
    } else {
      // user is signed in automatically
      toast.success('Welcome!')
    }
  }

  return (
    <>
      <Metadata title="Signup" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />
        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">新規登録</h2>
            </header>

            <div className="rw-segment-main">
              <div className="rw-form-wrapper">
                <Form onSubmit={onSubmit} className="rw-form-wrapper">
                  <Label
                    name="username"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    メールアドレス
                  </Label>
                  <TextField
                    name="username"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={usernameRef}
                    placeholder="user0001@coauthor.com"
                    validation={{
                      required: {
                        value: true,
                        message: 'メールアドレスを入力してください',
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'メールアドレスの形式で入力してください',
                      },
                    }}
                  />
                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    パスワード
                  </Label>
                  <PasswordField
                    name="password"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={passwordRef}
                    autoComplete="current-password"
                    placeholder="********"
                    validation={{
                      required: {
                        value: true,
                        message: 'パスワードを入力してください',
                      },
                      minLength: {
                        value: 8,
                        message: '8文字以上で入力してください',
                      },
                      pattern: {
                        value: /^[A-Za-z0-9@?;:]+$/,
                        message: '英数字記号（@?;:）で入力してください',
                      },
                      validate: (value) => {
                        if (value !== passwordConfirmRef.current?.value) {
                          return 'パスワードが一致しません'
                        }
                      },
                    }}
                  />
                  <FieldError name="password" className="rw-field-error" />

                  <Label
                    name="password-confirm"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    パスワード(確認)
                  </Label>
                  <PasswordField
                    name="password-confirm"
                    className="rw-input"
                    errorClassName="rw-input rw-input-error"
                    ref={passwordConfirmRef}
                    autoComplete="current-password"
                    placeholder="********"
                    validation={{
                      required: {
                        value: true,
                        message: 'パスワード(確認)を入力してください',
                      },
                      minLength: {
                        value: 8,
                        message: '8文字以上で入力してください',
                      },
                      pattern: {
                        value: /^[A-Za-z0-9@?;:]+$/,
                        message: '英数字記号（@?;:）で入力してください',
                      },
                      validate: (value) => {
                        if (value !== passwordRef.current?.value) {
                          return 'パスワードが一致しません'
                        }
                      },
                    }}
                  />
                  <FieldError
                    name="password-confirm"
                    className="rw-field-error"
                  />

                  <div className="rw-button-group">
                    <Submit className="rw-button rw-button-blue">
                      新規登録
                    </Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          <div className="rw-login-link">
            <span>既にユーザー登録されていますか?</span>{' '}
            <Link to={routes.login()} className="rw-link">
              ログイン!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default SignupPage
