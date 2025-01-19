"use client"

import { cn } from "@/lib/utils"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Button } from "../ui/button"
import { signInWithEmailAndPassword } from "firebase/auth"
import { firebaseClient } from "@/utils/firebaseClient"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { OAuthBar } from "../molecules/OAuthBar"
import { ValidateUtility } from "@/utils/utilities/ValidateUtility"
import { FirebaseError } from "firebase/app"
import { ApiV1Utility } from "@/utils/utilities/ApiV1Utility"
import { toast } from "sonner"

export function CoAuthorLoginForm({ className }: { className?: string }) {
  const {
    trySignIn,
    email,
    emailValidate,
    password,
    passwordValidate,
    showPassword,
    onChangeEmail,
    onChangePassword,
    toggleShowPassword,
    signinWithEmail,
  } = useCoAuthorLoginForm()

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className='flex flex-col items-center gap-2 text-center'>
        <h1 className='text-2xl font-bold'>ログイン</h1>
        <p className='text-balance text-sm text-muted-foreground'>
          ログイン方法を選択してください
        </p>
      </div>

      <div className='grid gap-6'>
        <div className='grid gap-2'>
          <Label htmlFor='email'>メールアドレス</Label>
          <Input
            id='email'
            type='email'
            placeholder='user123@coauthor.com'
            disabled={trySignIn}
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
            {/* <a
              href='#'
              className='ml-auto text-sm underline-offset-4 hover:underline'
            >
              Forgot your password?
            </a> */}
          </div>

          <div className='relative'>
            <Input
              id='password'
              type={showPassword ? "text" : "password"}
              disabled={trySignIn}
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

        <Button
          className='w-full'
          disabled={trySignIn}
          onClick={signinWithEmail}
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
        アカウント未登録ですか？{" "}
        <Link href={"/login/new"} className='underline underline-offset-4'>
          新規登録
        </Link>
      </div>
    </div>
  )
}

function useCoAuthorLoginForm() {
  const [trySignIn, setTrySignIn] = useState(false)

  const [checked, setChecked] = useState(false)
  const [email, setEmail] = useState("")
  const [emailValidate, setEmailValidate] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [passwordValidate, setPasswordValidate] = useState<string | null>(null)

  const [showPassword, setShowPassword] = useState(false)

  const signinWithEmail = () => {
    if (trySignIn) return

    const validateResultEmail = _validateEmail(email)
    const validateResultPassword = _validatePassword(password)
    setEmailValidate(validateResultEmail)
    setPasswordValidate(validateResultPassword)

    if (validateResultEmail || validateResultPassword) {
      toast.warning("入力内容を確認してください", {
        duration: 5000,
      })
      return
    }

    setTrySignIn(true)
    setChecked(true)

    signInWithEmailAndPassword(firebaseClient.auth, email, password)
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
        setTrySignIn(false)
      })
  }

  const toggleShowPassword = () => setShowPassword(!showPassword)

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
      return
    }
    toast.error("ログインシステムに不具合が発生しています", {
      description: `CODEv2: ${result.error.code}`,
    })
  }

  return {
    trySignIn,
    email,
    emailValidate,
    password,
    passwordValidate,
    showPassword,

    onChangeEmail,
    onChangePassword,
    toggleShowPassword,
    signinWithEmail,
  }
}
