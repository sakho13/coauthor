"use client"

import { cn } from "@/lib/utils"
import { Label } from "@radix-ui/react-label"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useState } from "react"
import Link from "next/link"
import { OAuthBar } from "../molecules/OAuthBar"
import { firebaseClient } from "@/utils/firebaseClient"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { ValidateUtility } from "@/utils/utilities/ValidateUtility"
import { toast } from "sonner"
import { ApiV1Utility } from "@/utils/utilities/ApiV1Utility"

export function CoAuthorSignupForm({ className }: { className?: string }) {
  const {
    trySignUp,
    email,
    emailValidate,
    password,
    passwordValidate,
    showPassword,
    passwordConfirm,
    passwordConfirmValidate,
    showPasswordConfirm,
    onChangeEmail,
    onChangePassword,
    onChangePasswordConfirm,
    toggleShowPassword,
    toggleShowPasswordConfirm,
    signupWithEmail,
  } = useCoAuthorSignupForm()

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>新規登録</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          下記項目を入力してください
        </p>
      </div>

      <div className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>メールアドレス</Label>
          <Input
            id='email'
            type='email'
            placeholder='user123@coauthor.com'
            required
            disabled={trySignUp}
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
          />
          {emailValidate && (
            <p className='text-xs text-red-500'>{emailValidate}</p>
          )}
        </div>

        <div className='grid gap-2'>
          <div className='flex items-center'>
            <Label htmlFor='password'>パスワード</Label>
          </div>

          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? "text" : "password"}
              required
              disabled={trySignUp}
              value={password}
              onChange={(e) => onChangePassword(e.target.value)}
            />
            <button
              onClick={toggleShowPassword}
              className='absolute inset-y-0 right-0 flex items-center pr-3'
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
            {passwordValidate && (
              <p className='text-xs text-red-500'>{passwordValidate}</p>
            )}
          </div>
        </div>

        <div className='grid gap-2'>
          <div className='flex items-center'>
            <Label htmlFor='password-confirm'>パスワード（確認用）</Label>
          </div>

          <div className='relative'>
            <Input
              id='password-confirm'
              type={showPasswordConfirm ? "text" : "password"}
              required
              disabled={trySignUp}
              value={passwordConfirm}
              onChange={(e) => onChangePasswordConfirm(e.target.value)}
            />
            <button
              onClick={toggleShowPasswordConfirm}
              className='absolute inset-y-0 right-0 flex items-center pr-3'
            >
              {showPasswordConfirm ? <Eye /> : <EyeOff />}
            </button>
            {passwordConfirmValidate && (
              <p className='text-xs text-red-500'>{passwordConfirmValidate}</p>
            )}
          </div>
        </div>

        <Button
          className='w-full'
          disabled={trySignUp}
          onClick={signupWithEmail}
        >
          ログイン
        </Button>

        <div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
          <span className='relative z-10 bg-background px-2 text-muted-foreground'>
            その他のログイン方法
          </span>
        </div>

        <OAuthBar disabled={true} />
      </div>

      <div className='text-center text-sm'>
        アカウント作成済みですか？
        <Link href={"/login"} className='underline underline-offset-4'>
          ログイン
        </Link>
      </div>
    </div>
  )
}

function useCoAuthorSignupForm() {
  const [trySignUp, setTrySignUp] = useState(false)

  const [checked, setChecked] = useState(false)
  const [email, setEmail] = useState("")
  const [emailValidate, setEmailValidate] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [passwordValidate, setPasswordValidate] = useState<string | null>(null)
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [passwordConfirmValidate, setPasswordConfirmValidate] = useState<
    string | null
  >(null)

  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)

  const signupWithEmail = () => {
    if (trySignUp) return

    const validateResultEmail = _validateEmail(email)
    const validateResultPassword = _validatePassword(password)
    const validateResultPasswordConfirm = _validatePassword(passwordConfirm)
    setEmailValidate(validateResultEmail)
    setPasswordValidate(validateResultPassword)
    setPasswordConfirmValidate(validateResultPasswordConfirm)

    if (
      validateResultEmail ||
      validateResultPassword ||
      validateResultPasswordConfirm
    ) {
      toast.warning("入力内容を確認してください", {
        duration: 5000,
      })
      return
    }

    if (password !== passwordConfirm) {
      setPasswordValidate("パスワードが一致しません")
      setPasswordConfirmValidate("パスワードが一致しません")
      return
    }

    setTrySignUp(true)
    setChecked(true)

    createUserWithEmailAndPassword(firebaseClient.auth, email, password)
      .then(async (userCredential) => {
        await _recordUserToCoAuthor(await userCredential.user.getIdToken())
      })
      .catch((error) => {
        if (error instanceof FirebaseError) {
          toast.error("ログインシステムに不具合が発生しています", {
            description: `CODE: ${error.code}`,
          })
          return
        }
        toast.error(
          "ログインシステムに不具合が発生しています。しばらくしてから再度お試しください。",
        )
      })
      .finally(() => {
        setTrySignUp(false)
      })
  }

  const toggleShowPassword = () => setShowPassword(!showPassword)
  const toggleShowPasswordConfirm = () =>
    setShowPasswordConfirm(!showPasswordConfirm)

  const onChangeEmail = (value: string) => {
    setEmail(value)

    if (checked) {
      setEmailValidate(_validateEmail(value))
    }
  }

  const onChangePassword = (value: string) => {
    setPassword(value)

    if (checked) {
      setPasswordValidate(_validatePassword(value))
    }
  }

  const onChangePasswordConfirm = (value: string) => {
    setPasswordConfirm(value)

    if (checked) {
      setPasswordConfirmValidate(_validatePassword(value))
    }
  }

  const _validateEmail = (value: string) => {
    if (ValidateUtility.isEmptyString(value)) {
      return "メールアドレスを入力してください"
    } else if (!ValidateUtility.isEmail(value)) {
      return "メールアドレスの形式が正しくありません"
    } else {
      return null
    }
  }

  const _validatePassword = (value: string) => {
    if (ValidateUtility.isEmptyString(value)) {
      return "パスワードを入力してください"
    } else if (!ValidateUtility.isGreaterThanEqualLen(value, 8)) {
      return "パスワードは8文字以上で入力してください"
    } else {
      return null
    }
  }

  const _recordUserToCoAuthor = async (token: string) => {
    const result = await ApiV1Utility.postUser(token)
    if (result.success) {
      toast.info("ログインしました")
      return
    }
    toast.error("ログインシステムに不具合が発生しています", {
      description: `CODEv2: ${result.error.code}`,
    })
  }

  return {
    trySignUp,
    email,
    emailValidate,
    password,
    passwordValidate,
    showPassword,
    passwordConfirm,
    passwordConfirmValidate,
    showPasswordConfirm,

    onChangeEmail,
    onChangePassword,
    onChangePasswordConfirm,
    toggleShowPassword,
    toggleShowPasswordConfirm,
    signupWithEmail,
  }
}
