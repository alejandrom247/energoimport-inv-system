//import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'
import { Button } from '@renderer/components/ui/button'
import { ThemeProvider } from './components/theme-provider'
import ThemeModeToggle from './components/toggle-mode'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  /*return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
            Send IPC
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )*/
 return (
  <ThemeProvider>
      <main className="h-svh text-center bg-background p-20">
        
        <div className="flex gap-4 justify-center items-center mb-12">
          <Button
            className="px-6 py-2 text-primary-foreground 
            bg-primary hover:bg-secondary hover:text-secondary-foreground rounded-full transition-colors"
          >
            Documentation
          </Button>
        </div>
      </main>
    </ThemeProvider>
  
 )
}

export default App
