// "use client";

// import React, { useState, useCallback } from "react";
// import type {
//   I_SidebarProps,
//   I_SidebarSection,
//   I_SidebarLinkItem,
//   I_SidebarDropdownItem,
//   T_SidebarItem,
//   I_NavLink,
//   I_DropdownOption,
// } from "@rnb/types";

// // ============================================================================
// // Types
// // ============================================================================

// export interface I_SidebarComponentProps extends I_SidebarProps {
//   onLinkClick?: (link: I_NavLink) => void;
//   onDropdownOptionClick?: (option: I_DropdownOption) => void;
//   renderLink?: (item: I_SidebarLinkItem) => React.ReactNode;
//   renderDropdownRoot?: (
//     item: I_SidebarDropdownItem,
//     isOpen: boolean
//   ) => React.ReactNode;
//   renderDropdownOption?: (
//     option: I_DropdownOption,
//     depth: number
//   ) => React.ReactNode;
// }

// // ============================================================================
// // Utilities
// // ============================================================================

// const hasChildren = (option: I_DropdownOption): boolean =>
//   Array.isArray(option.children) && option.children.length > 0;

// // ============================================================================
// // Sub-components
// // ============================================================================

// interface DropdownOptionsProps {
//   options: I_DropdownOption[];
//   depth: number;
//   openIds: Set<string>;
//   onToggle: (id: string) => void;
//   onOptionClick?: (option: I_DropdownOption) => void;
//   renderOption?: (option: I_DropdownOption, depth: number) => React.ReactNode;
// }

// const DropdownOptions: React.FC<DropdownOptionsProps> = ({
//   options,
//   depth,
//   openIds,
//   onToggle,
//   onOptionClick,
//   renderOption,
// }) => (
//   <ul>
//     {options.map((option) => {
//       const isOpen = openIds.has(option.id);
//       const hasNested = hasChildren(option);

//       const handleClick = () => {
//         if (hasNested) onToggle(option.id);
//         if (onOptionClick && !option.disabled) onOptionClick(option);
//       };

//       return (
//         <li key={option.id}>
//           <button
//             type="button"
//             onClick={handleClick}
//             disabled={option.disabled}
//           >
//             {renderOption ? renderOption(option, depth) : option.label}
//           </button>

//           {hasNested && isOpen && (
//             <DropdownOptions
//               options={option.children!}
//               depth={depth + 1}
//               openIds={openIds}
//               onToggle={onToggle}
//               onOptionClick={onOptionClick}
//               renderOption={renderOption}
//             />
//           )}
//         </li>
//       );
//     })}
//   </ul>
// );

// // ============================================================================
// // Item Renderers
// // ============================================================================

// interface LinkItemProps {
//   item: I_SidebarLinkItem;
//   onLinkClick?: (link: I_NavLink) => void;
//   renderLink?: (item: I_SidebarLinkItem) => React.ReactNode;
// }

// const LinkItem: React.FC<LinkItemProps> = ({
//   item,
//   onLinkClick,
//   renderLink,
// }) => {
//   const handleClick = () => onLinkClick?.(item.link);

//   if (renderLink) {
//     return (
//       <button type="button" onClick={handleClick}>
//         {renderLink(item)}
//       </button>
//     );
//   }

//   return (
//     <button type="button" onClick={handleClick}>
//       {item.link.label ?? "Link"}
//     </button>
//   );
// };

// interface DropdownItemProps {
//   item: I_SidebarDropdownItem;
//   isOpen: boolean;
//   onToggle: (id: string) => void;
//   openIds: Set<string>;
//   onDropdownOptionClick?: (option: I_DropdownOption) => void;
//   renderDropdownRoot?: (
//     item: I_SidebarDropdownItem,
//     isOpen: boolean
//   ) => React.ReactNode;
//   renderDropdownOption?: (
//     option: I_DropdownOption,
//     depth: number
//   ) => React.ReactNode;
// }

// const DropdownItem: React.FC<DropdownItemProps> = ({
//   item,
//   isOpen,
//   onToggle,
//   openIds,
//   onDropdownOptionClick,
//   renderDropdownRoot,
//   renderDropdownOption,
// }) => {
//   const handleRootClick = () => onToggle(item.id);

//   return (
//     <div>
//       {renderDropdownRoot ? (
//         renderDropdownRoot(item, isOpen)
//       ) : (
//         <button type="button" onClick={handleRootClick}>
//           {item.dropdown.label}
//         </button>
//       )}

//       {isOpen && hasChildren(item.dropdown) && (
//         <DropdownOptions
//           options={item.dropdown.children!}
//           depth={1}
//           openIds={openIds}
//           onToggle={onToggle}
//           onOptionClick={onDropdownOptionClick}
//           renderOption={renderDropdownOption}
//         />
//       )}
//     </div>
//   );
// };

// interface SidebarItemProps {
//   item: T_SidebarItem;
//   openIds: Set<string>;
//   onToggle: (id: string) => void;
//   onLinkClick?: (link: I_NavLink) => void;
//   onDropdownOptionClick?: (option: I_DropdownOption) => void;
//   renderLink?: (item: I_SidebarLinkItem) => React.ReactNode;
//   renderDropdownRoot?: (
//     item: I_SidebarDropdownItem,
//     isOpen: boolean
//   ) => React.ReactNode;
//   renderDropdownOption?: (
//     option: I_DropdownOption,
//     depth: number
//   ) => React.ReactNode;
// }

// const SidebarItem: React.FC<SidebarItemProps> = ({
//   item,
//   openIds,
//   onToggle,
//   onLinkClick,
//   onDropdownOptionClick,
//   renderLink,
//   renderDropdownRoot,
//   renderDropdownOption,
// }) => {
//   if (item.kind === "link") {
//     return (
//       <LinkItem item={item} onLinkClick={onLinkClick} renderLink={renderLink} />
//     );
//   }

//   if (item.kind === "dropdown") {
//     return (
//       <DropdownItem
//         item={item}
//         isOpen={openIds.has(item.id)}
//         onToggle={onToggle}
//         openIds={openIds}
//         onDropdownOptionClick={onDropdownOptionClick}
//         renderDropdownRoot={renderDropdownRoot}
//         renderDropdownOption={renderDropdownOption}
//       />
//     );
//   }

//   return null;
// };

// // ============================================================================
// // Section Component
// // ============================================================================

// interface SectionProps {
//   section: I_SidebarSection;
//   index: number;
//   openIds: Set<string>;
//   onToggle: (id: string) => void;
//   onLinkClick?: (link: I_NavLink) => void;
//   onDropdownOptionClick?: (option: I_DropdownOption) => void;
//   renderLink?: (item: I_SidebarLinkItem) => React.ReactNode;
//   renderDropdownRoot?: (
//     item: I_SidebarDropdownItem,
//     isOpen: boolean
//   ) => React.ReactNode;
//   renderDropdownOption?: (
//     option: I_DropdownOption,
//     depth: number
//   ) => React.ReactNode;
// }

// const Section: React.FC<SectionProps> = ({
//   section,
//   index,
//   openIds,
//   onToggle,
//   onLinkClick,
//   onDropdownOptionClick,
//   renderLink,
//   renderDropdownRoot,
//   renderDropdownOption,
// }) => (
//   <section key={section.sectionName ?? index}>
//     {section.sectionName && <h2>{section.sectionName}</h2>}
//     <nav aria-label={section.sectionName}>
//       <ul>
//         {section.sectionContents.map((item) => (
//           <li key={item.id}>
//             <SidebarItem
//               item={item}
//               openIds={openIds}
//               onToggle={onToggle}
//               onLinkClick={onLinkClick}
//               onDropdownOptionClick={onDropdownOptionClick}
//               renderLink={renderLink}
//               renderDropdownRoot={renderDropdownRoot}
//               renderDropdownOption={renderDropdownOption}
//             />
//           </li>
//         ))}
//       </ul>
//     </nav>
//   </section>
// );

// // ============================================================================
// // Main Sidebar Component
// // ============================================================================

// export const Sidebar: React.FC<I_SidebarComponentProps> = ({
//   sidebarData,
//   isMobile,
//   onLinkClick,
//   onDropdownOptionClick,
//   renderLink,
//   renderDropdownRoot,
//   renderDropdownOption,
// }) => {
//   const [openIds, setOpenIds] = useState<Set<string>>(new Set());

//   const toggleOpenId = useCallback((id: string) => {
//     setOpenIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) {
//         next.delete(id);
//       } else {
//         next.add(id);
//       }
//       return next;
//     });
//   }, []);

//   const { header, content, footer } = sidebarData;

//   return (
//     <aside aria-label="Sidebar">
//       {header && (
//         <header>
//           {header.logo && <div>{/* logo rendering */}</div>}
//           {header.header && <h1>{header.header}</h1>}
//         </header>
//       )}

//       <div>
//         {content.map((section, index) => (
//           <Section
//             key={section.sectionName ?? index}
//             section={section}
//             index={index}
//             openIds={openIds}
//             onToggle={toggleOpenId}
//             onLinkClick={onLinkClick}
//             onDropdownOptionClick={onDropdownOptionClick}
//             renderLink={renderLink}
//             renderDropdownRoot={renderDropdownRoot}
//             renderDropdownOption={renderDropdownOption}
//           />
//         ))}
//       </div>

//       {footer && (
//         <footer>
//           <Section
//             section={footer.footerContents}
//             index={-1}
//             openIds={openIds}
//             onToggle={toggleOpenId}
//             onLinkClick={onLinkClick}
//             onDropdownOptionClick={onDropdownOptionClick}
//             renderLink={renderLink}
//             renderDropdownRoot={renderDropdownRoot}
//             renderDropdownOption={renderDropdownOption}
//           />
//         </footer>
//       )}
//     </aside>
//   );
// };
