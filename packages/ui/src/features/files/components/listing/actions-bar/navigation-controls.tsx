import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'
import {useLocation, useNavigate} from 'react-router-dom'

import {ChevronLeftIcon} from '@/features/files/assets/chevron-left'
import {ChevronRightIcon} from '@/features/files/assets/chevron-right'
import {BASE_ROUTE_PATH, SEARCH_PATH} from '@/features/files/constants'
import {cn} from '@/shadcn-lib/utils'

/**
 * File browser navigation controls that track visited folder paths.
 * Maintains clean paths without query parameters to prevent
 * dialog re-renders during back/forward navigation.
 */
export function NavigationControls() {
	const location = useLocation()
	const navigate = useNavigate()

	// Track visited paths and current position
	const [navigation, setNavigation] = useState({
		paths: [location.pathname],
		currentPathIndex: 0,
	})

	// Add new path when location.pathname or location.search changes
	// and store the latest path in session storage for the Dock to restore
	useEffect(() => {
		const isSearchPage = location.pathname === `${BASE_ROUTE_PATH}${SEARCH_PATH}`
		const newPath = isSearchPage ? `${location.pathname}${location.search}` : location.pathname

		setNavigation((current) => {
			// TODO: THIS IS A HACK
			// Save the latest path to session storage
			// The Dock then uses this to restore the last visited path
			sessionStorage.setItem('lastFilesPath', newPath)

			const lastPath = current.paths[current.currentPathIndex]

			// If the new path is the same as the last path, do nothing
			if (newPath === lastPath) {
				return current
			}

			// If the new path is a search page and the last path was also a search page,
			// update the last path with the new path so we don't store the path for every
			// search query character (e.g., "?q=t" => "?q=te" => "?q=tes" => "?q=test")
			if (isSearchPage && lastPath.startsWith(`${BASE_ROUTE_PATH}${SEARCH_PATH}`)) {
				const updatedPaths = [...current.paths.slice(0, current.currentPathIndex), newPath]
				return {
					paths: updatedPaths,
					currentPathIndex: current.currentPathIndex,
				}
			}

			// Normal navigation push, truncate any forward history
			const updatedPaths = [...current.paths.slice(0, current.currentPathIndex + 1), newPath]
			return {
				paths: updatedPaths,
				currentPathIndex: updatedPaths.length - 1,
			}
		})
	}, [location.pathname, location.search])

	// Navigation handlers
	const handleBack = () => {
		if (!canGoBack) return
		const prevIndex = navigation.currentPathIndex - 1
		setNavigation((curr) => ({...curr, currentPathIndex: prevIndex}))
		navigate(navigation.paths[prevIndex])
	}

	const handleForward = () => {
		if (!canGoForward) return
		const nextIndex = navigation.currentPathIndex + 1
		setNavigation((curr) => ({...curr, currentPathIndex: nextIndex}))
		navigate(navigation.paths[nextIndex])
	}

	// can go back if there is a previous path
	const canGoBack = Boolean(navigation.paths[navigation.currentPathIndex - 1])
	// can go forward if there is a next path
	const canGoForward = Boolean(navigation.paths[navigation.currentPathIndex + 1])

	return (
		<div className='flex items-center gap-2'>
			<motion.button
				onClick={handleBack}
				disabled={!canGoBack}
				className={cn('p-0 hover:bg-transparent focus:ring-0 focus-visible:ring-0', {
					'opacity-50': !canGoBack,
				})}
				whileTap={{scale: 0.85}}
				aria-label='Go back'
			>
				<ChevronLeftIcon className='h-5 w-5' />
			</motion.button>
			<motion.button
				onClick={handleForward}
				disabled={!canGoForward}
				className={cn('p-0 hover:bg-transparent focus:ring-0 focus-visible:ring-0', {
					'opacity-50': !canGoForward,
				})}
				whileTap={{scale: 0.85}}
				aria-label='Go forward'
			>
				<ChevronRightIcon className='h-5 w-5' />
			</motion.button>
		</div>
	)
}
