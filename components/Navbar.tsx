import Image from "next/image"
import Link from "next/link"

const navIcons:any=[{src:'/assets/icons/search.svg',alt:'search'},
  {src:'/assets/icons/black-heart.svg',alt:'heart'},
  {src:'/assets/icons/user.svg',alt:'user'}
]
const Navbar = () => {
 
  return (
  <header className="w-full">
    <nav className="nav">
<Link href="/" className="flex items-center gap-1">
  <Image src="/assets/icons/logo.svg" alt="logo" width={27} height={27}/>
<p className="nav-logo">
  Price<span className="text-primary">Wise</span>
</p>
</Link>
<div className="flex items-center gap-5">
{navIcons.map((icon:any) => {
        return (
          <Image className="object-contain" key={icon.alt} alt={icon.alt} src={icon.src} width={28} height={28}/>
        );
      })}
  
</div>
    </nav>
  </header>
  )
}

export default Navbar
