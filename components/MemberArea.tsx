import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ArrowRight, ArrowRightIcon, Link2Icon } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "./ui/tabs";

const MemberArea = async () => {
  return (
    <section className="my-12">
      <div className=" mx-auto">
        <Tabs defaultValue="who" className="">
          <TabsList className="grid w-full grid-cols-4 gap-2 text-center">
            <TabsTrigger value="who">NovoTec®</TabsTrigger>
            <TabsTrigger value="advantages">Vorteile</TabsTrigger>
            <TabsTrigger value="how">Zusammenarbeit</TabsTrigger>
            <TabsTrigger value="payment">Bezahlung</TabsTrigger>
          </TabsList>
          <TabsContent value="who">
            <Card>
              <CardHeader>
                <CardTitle>Wer ist NovoTec®?</CardTitle>
                <CardDescription>
                  Novotec ist ein Unternehmen, das sich auf Ausbau- und
                  Sanierungsmanagement spezialisiert hat.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Wir sind ein Unternehmen, das sich auf Ausbau- und
                  Sanierungsmanagement spezialisiert hat. Wir bieten Ihnen die
                  Möglichkeit, Ihr Zuhause zu renovieren oder umzubauen, ohne
                  dass Sie sich um die Organisation kümmern müssen. Wir kümmern
                  uns um alles, von der Planung bis zur Umsetzung. Unser Ziel
                  ist es, Ihnen ein Zuhause zu schaffen, in dem Sie sich
                  wohlfühlen und das Ihren individuellen Bedürfnissen
                  entspricht.
                </p>
                <div className="flex items-center mt-4 text-red-500">
                  <Link2Icon className="mr-2" />
                  <a href="https://novotec-gruppe.de" target="_blank">
                    Mehr erfahren
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="advantages">
            <Card>
              <CardHeader>
                <CardTitle>Vorteile einer Zusammenarbeit</CardTitle>
                <CardDescription>
                  Eine Zusammenarbeit mit NovoTec® bietet viele Vorteile.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Kein Recruiting</li>
                  <li>Keine Aufmaße</li>
                  <li>Minimale Administration</li>
                  <li>Maximale Zeit auf der Baustelle</li>
                </ul>
              </CardContent>
              <CardFooter className="flex items-center">
                <Avatar className="mr-4">
                  <AvatarImage src="/avatar.png" alt="Avataer" />
                </Avatar>
                <blockquote>
                  <div>
                    <p className="text-gray-800 dark:text-white text-sm">
                      <em>
                        "Die Zusammenarbeit mit NovoTec® ist für uns ein großer
                        Gewinn."
                      </em>
                    </p>
                  </div>
                </blockquote>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="how">
            <Card>
              <CardHeader>
                <CardTitle>Wie funktioniert die Zusammenarbeit?</CardTitle>
                <CardDescription>
                  Eine Zusammenarbeit gliedert sich in mehrere Schritte.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>
                    Zusendung von Projektangeboten per Pushnachrichten Whatsapp
                    oder E-Mail
                  </li>
                  <li>Ampelsystem aktiv/gesperrt</li>
                  <li>Ersten drei Projekte per Werkvertrag</li>
                </ul>
              </CardContent>
              <CardFooter className="flex items-center"></CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Wie viel und wann zahlen wir?</CardTitle>
                <CardDescription>
                  Ein faires und transparentes Zahlungsmodell.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  <li>Einblick in die Basispreise</li>
                  <li>...</li>
                  <li>...</li>
                </ul>
              </CardContent>
              <CardFooter className="flex items-center"></CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <div className="w-full text-center bg-gray-100 mt-12 p-8 rounded-lg">
        <h3 className="text-xl md:text-3xl font-bold">
          Vervollständige jetzt dein Profil, um Partner zu werden.
        </h3>
        <div className="w-full mx-auto flex justify-center">
          <Link href="/mein-profil">
            <Button className="mt-4 w-[300px] flex" size={"lg"}>
              zum Profil
              <ArrowRightIcon className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MemberArea;
