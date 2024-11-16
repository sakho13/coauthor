import { useEffect, useRef } from 'react'

import {
  Form,
  Label,
  TextField,
  PasswordField,
  Submit,
  FieldError,
} from '@redwoodjs/forms'
import { Link, navigate, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import { toast, Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'

const LoginPage = () => {
  const { isAuthenticated, logIn } = useAuth()

  useEffect(() => {
    if (isAuthenticated) {
      navigate(routes.myBookshelf())
    }
  }, [isAuthenticated])

  const usernameRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    usernameRef.current?.focus()
  }, [])

  const onSubmit = async (data: Record<string, string>) => {
    const response = await logIn({
      username: data.username,
      password: data.password,
    })
    console.log('response:', response)

    if (response.message) {
      toast(response.message)
    } else if (response.error) {
      if (typeof response.error === 'string') {
        if (response.error.includes('not found')) {
          toast.error(`ユーザ登録を行ってください ${data.username}`)
        }
        return
      }
      toast.error('現在ログインできません 問い合わせください🙏')
    } else {
      toast.success('Welcome back!')
    }
  }

  return (
    <>
      <Metadata title="Login" />

      <main className="rw-main">
        <Toaster toastOptions={{ className: 'rw-toast', duration: 6000 }} />

        <div className="rw-scaffold rw-login-container">
          <div className="rw-segment">
            <header className="rw-segment-header">
              <h2 className="rw-heading rw-heading-secondary">ログイン</h2>
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
                  <div className="flex">
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
                  </div>
                  <FieldError name="username" className="rw-field-error" />

                  <Label
                    name="password"
                    className="rw-label"
                    errorClassName="rw-label rw-label-error"
                  >
                    パスワード
                  </Label>
                  <div className="flex">
                    <PasswordField
                      name="password"
                      className="rw-input"
                      errorClassName="rw-input rw-input-error"
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
                      }}
                    />
                  </div>
                  <FieldError name="password" className="rw-field-error" />

                  <div className="rw-forgot-link">
                    <Link
                      to={routes.forgotPassword()}
                      className="rw-forgot-link"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="rw-button-group">
                    {/* rw-button rw-button-blue */}
                    <Submit className="btn btn-secondary">ログイン</Submit>
                  </div>
                </Form>
              </div>
            </div>
          </div>

          <div className="rw-login-link">
            <span>ユーザー登録へ</span>{' '}
            <Link to={routes.signup()} className="rw-link">
              Sign up!
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage
