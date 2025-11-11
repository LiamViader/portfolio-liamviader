export function PersonalSection() {
  return (
    <section className="relative px-4 pb-20 pt-10 sm:px-6 lg:px-12 lg:pb-24 lg:pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950 to-gray-950" />

      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-10 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-semibold text-white sm:text-3xl">
            Más allá del código
          </h2>
          <p className="text-sm text-white/70 sm:text-base leading-relaxed">
            Aquí puedes hablar de las cosas que te gustan a nivel personal:
            qué te inspira, qué te relaja, qué te obsesiona un poco (en el
            buen sentido). Por ejemplo: el cielo, la luz de ciertas horas,
            videojuegos concretos, música, deporte, lo que te haga ser tú.
          </p>
          <p className="text-sm text-white/70 sm:text-base leading-relaxed">
            Intenta que no sea una lista fría, sino pequeños detalles
            concretos. En vez de “me gusta la naturaleza”, puedes escribir
            algo como “me encanta salir a caminar cuando el cielo está
            nublado y parece que todo va más lento”.
          </p>
          <p className="text-sm text-white/60 sm:text-base leading-relaxed">
            También puedes conectar esta parte con cómo te afecta al trabajo:
            cómo tus hobbies influyen en tu forma de diseñar sistemas, pensar
            en problemas o colaborar con otras personas.
          </p>
        </div>

        <div className="flex-1">
          <div className="relative mx-auto aspect-[4/3] max-w-md overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-sky-500/20 via-sky-500/5 to-indigo-500/10 shadow-[0_40px_80px_-60px_rgba(56,189,248,0.7)]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-2xl border border-white/20 bg-black/30 px-4 py-3 text-center text-sm text-white/75 backdrop-blur-md">
                Aquí puedes poner una foto tuya, del cielo, o cualquier imagen
                que conecte con esta parte más personal.
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-white/50 text-center">
            Puedes sustituir el contenido de este recuadro por un{" "}
            <code className="font-mono text-[11px]">
              &lt;Image src=&quot;/ruta/a/tu/imagen.jpg&quot; /&gt;
            </code>{" "}
            usando el mismo estilo que en tu portada.
          </p>
        </div>
      </div>
    </section>
  );
}
