export default function Header() {
    return (
        // <nav className="component-preview flex w-full items-center justify-center gap-2 p-2">
        //     <div role="navigation" aria-label="Navbar" className="navbar">
        //         <div className="flex-1 navbar-start">
        //             <div role="listbox" className="dropdown">
        //                 <label >
        //                     <button className="btn lg:hidden btn-ghost"></button>
        //                     <ul className="dropdown-content menu shadow rounded-box menu-compact z-10 mt-3 w-52 rounded-lg border border-gray-200 bg-base-100 p-2 dark:border-gray-700 dark:bg-gray-900">
        //                         <li className="overflow-hidden rounded-md text-base font-medium leading-6 transition duration-150 ease-in-out focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><a href="/">Product</a></li>
        //                         <li className="overflow-hidden rounded-md text-base font-medium leading-6 transition duration-150 ease-in-out focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><a href="/contact">Contact</a></li>
        //                         <li className="overflow-hidden rounded-md text-base font-medium leading-6 transition duration-150 ease-in-out focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><a href="/newsletter">Newsletter</a></li>
        //                     </ul>
        //                 </label>
        //
        //                 <ul className="dropdown-content"></ul>
        //             </div>
        //             <div className="btn-ghost btn text-xl normal-case">
        //                 <a className="hidden md:block flex" href="/">VeriEQL Web</a>
        //                 <a className="md:hidden flex" href="/">VeriEQL Web</a>
        //             </div>
        //         </div>
        //         <div className="hidden lg:flex navbar-center">
        //             <ul role="menu" className="menu flex items-center p-0 menu-horizontal">
        //                 <li role="menuitem" className="overflow-hidden rounded-md text-base font-medium leading-6 transition duration-150 ease-in-out focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><a href="/">Home</a></li>
        //                 <li role="menuitem" className="overflow-hidden rounded-md text-base font-medium leading-6 transition duration-150 ease-in-out focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><a href="/contact">xxx</a></li>
        //                 <li role="menuitem" className="overflow-hidden rounded-md text-base font-medium leading-6 transition duration-150 ease-in-out focus:outline-none text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"><a href="/newsletter">xxx</a></li>
        //                 <div className="ml-2 flex items-center space-x-3">
        //                     <div><button type="button" className="hidden lg:flex group flex w-full items-center justify-center space-x-2 focus:outline-none"><span className="text-base font-medium"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></span><div className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2"><div className="h-3.5 w-6 rounded-full bg-gray-500 shadow-md outline-none transition"></div><div className="absolute top-1 left-1 inline-flex h-1.5 w-1.5 transform items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out
        //           "></div></div><span className="text-base font-medium"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg></span></button></div>
        //                 </div>
        //             </ul>
        //         </div>
        //         <div className="flex space-x-2 flex-1 navbar-end"></div>
        //     </div>
        // </nav>
        <nav className="">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="btn-ghost btn flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-xl font-semibold whitespace-nowrap">VeriEQL</span>
                </a>
                <button data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-default">
                    <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-6 rtl:space-x-reverse md:mt-0 md:border-0">
                        <li>
                            <a href="/" className="btn-ghost btn flex bg-gray-200 items-center space-x-3 rtl:space-x-reverse">
                                Home
                            </a>
                        </li>

                        <li>
                            <a href="/" className="btn-ghost btn flex items-center space-x-3 rtl:space-x-reverse">
                                About
                            </a>
                        </li>

                        {/*<div className="ml-2 flex items-center space-x-3">*/}
                        {/*    <div>*/}
                        {/*        <button type="button" className="hidden lg:flex group flex w-full items-center justify-center space-x-2 focus:outline-none">*/}
                        {/*            <span className="text-base font-medium">*/}
                        {/*                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>*/}
                        {/*            </span>*/}
                        {/*            <div className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-theme-500 focus:ring-offset-2">*/}
                        {/*                <div className="h-3.5 w-6 rounded-full bg-gray-500 shadow-md outline-none transition"></div>*/}
                        {/*                <div className="absolute top-1 left-1 inline-flex h-1.5 w-1.5 transform items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 ease-in-out"></div>*/}
                        {/*            </div>*/}
                        {/*            <span className="text-base font-medium">*/}
                        {/*                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>*/}
                        {/*            </span>*/}
                        {/*        </button>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </ul>
                </div>
            </div>
        </nav>
    )
}
