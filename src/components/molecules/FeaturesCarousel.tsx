import { Card, CardHeader, CardContent } from "../ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "../ui/carousel"

type Feature = {
  title: string
  description: string[]
}

export function FeaturesCarousel() {
  const features: Feature[] = [
    {
      title: "小説執筆",
      description: ["小説の種類に応じて連載、短編を執筆できます。"],
    },
    {
      title: "小説管理",
      description: [
        "執筆した小説を管理することができます。",
        "小説、章、キャラクターを管理できます。",
      ],
    },
  ]

  return (
    <Carousel>
      <CarouselContent>
        {features.map((feature, titleIndex) => (
          <CarouselItem
            key={`ca-feature-${titleIndex}`}
            className='md:basis-1/2 lg:basis-1/3 select-none'
          >
            <Card>
              <CardHeader>
                <h2>{feature.title}</h2>
              </CardHeader>
              <CardContent>
                {feature.description.map((description, descIndex) => (
                  <p key={`ca-feature-${titleIndex}-desc-${descIndex}`}>
                    {description}
                  </p>
                ))}
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
