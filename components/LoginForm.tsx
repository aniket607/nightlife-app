import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { signIn } from "@/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("w-full max-w-md mx-auto px-4 sm:px-0", className)} {...props}>
      <Card className="border-0 bg-white/10 backdrop-blur-md">
        <CardHeader className="space-y-2 sm:space-y-3 p-6 sm:p-8">
          <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-200 to-pink-200 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-300">
            Sign in to manage your venues and events
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 sm:p-8 pt-0 sm:pt-0">
          <form action={async () => {
            "use server"
            await signIn("google", { redirectTo: "/organizer" })
          }}>
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-3 w-full h-11 sm:h-12 rounded-xl border-2 border-white/10 bg-white/5 text-white transition-all hover:bg-white/10 hover:shadow-[0_0_2rem_-0.5rem_#fff8] hover:scale-[0.99] active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                  className="fill-current"
                />
              </svg>
              <span className="text-sm font-medium sm:text-base">
                Google
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="mt-6 text-center text-xs sm:text-sm text-gray-400 px-4 sm:px-0">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-gray-300 underline decoration-dotted underline-offset-4 transition-colors hover:text-white">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-gray-300 underline decoration-dotted underline-offset-4 transition-colors hover:text-white">
          Privacy Policy
        </a>
      </div>
    </div>
  )
}
