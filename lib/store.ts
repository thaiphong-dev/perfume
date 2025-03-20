import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "../lib/supabase";

// Cart Store
export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  itemCount: number;
  addToCart: (item: Omit<CartItem, "quantity">, quantity: number) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      addToCart: (item, quantity) => {
        set((state) => {
          // Check if item already exists in cart
          const existingItemIndex = state.items.findIndex(
            (i) => i.id === item.id
          );

          let newItems;
          if (existingItemIndex >= 0) {
            // Update quantity of existing item
            newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
          } else {
            // Add new item to cart
            newItems = [...state.items, { ...item, quantity }];
          }

          const newItemCount = newItems.reduce(
            (total, item) => total + item.quantity,
            0
          );

          return {
            items: newItems,
            itemCount: newItemCount,
          };
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          const newItems = state.items.filter((item) => item.id !== id);
          const newItemCount = newItems.reduce(
            (total, item) => total + item.quantity,
            0
          );

          return {
            items: newItems,
            itemCount: newItemCount,
          };
        });
      },

      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return get().removeFromCart(id), state;
          }

          const newItems = state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          );

          const newItemCount = newItems.reduce(
            (total, item) => total + item.quantity,
            0
          );

          return {
            items: newItems,
            itemCount: newItemCount,
          };
        });
      },

      clearCart: () => {
        set({ items: [], itemCount: 0 });
      },
    }),
    {
      name: "nire-beauty-cart", // name of the item in localStorage
    }
  )
);

// User Authentication Store
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          // Get additional user data from the users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (userError) throw userError;

          set({
            user: {
              id: data.user.id,
              name: userData.name || data.user.email?.split("@")[0] || "",
              email: data.user.email || "",
              ...userData,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Login error:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "An error occurred during login",
            isLoading: false,
          });
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name || email.split("@")[0],
              },
              emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
          });

          if (error) throw error;

          set({
            user: {
              id: data.user?.id || "",
              name: name || email.split("@")[0],
              email: email,
            },
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error("Registration error:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "An error occurred during registration",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null, isAuthenticated: false });
        } catch (error) {
          console.error("Logout error:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "An error occurred during logout",
          });
        }
      },

      updateProfile: async (userData) => {
        try {
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();
          if (error) throw error;
          if (!user) throw new Error("No user found");

          // Update user data in the users table
          const { error: updateError } = await supabase
            .from("users")
            .update(userData)
            .eq("id", user.id);

          if (updateError) throw updateError;

          set((state) => ({
            user: state.user ? { ...state.user, ...userData } : null,
          }));
        } catch (error) {
          console.error("Profile update error:", error);
          set({
            error:
              error instanceof Error
                ? error.message
                : "An error occurred while updating profile",
          });
        }
      },
    }),
    {
      name: "nire-beauty-auth", // name of the item in localStorage
    }
  )
);

// Language Store
type Language = "en" | "vi";

type LanguageState = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<Language, Record<string, string>>;
  t: (key: string) => string;
};

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      language: "en",

      setLanguage: (language) => {
        set({ language });
      },

      translations: {
        en: {
          // Common
          home: "Home",
          shop: "Shop",
          about: "About Us",
          contact: "Contact",
          blog: "Blog",
          search: "Search",
          account: "Account",
          wishlist: "Wishlist",
          cart: "Cart",
          login: "Login",
          register: "Register",
          logout: "Logout",
          my_account: "My Account",
          settings: "Settings",
          orders: "Orders",
          addresses: "Addresses",
          payment_methods: "Payment Methods",
          language: "Language",
          english: "English",
          vietnamese: "Vietnamese",
          save_changes: "Save Changes",
          cancel: "Cancel",
          submit: "Submit",
          email: "Email",
          password: "Password",
          confirm_password: "Confirm Password",
          name: "Name",
          phone: "Phone",
          address: "Address",
          city: "City",
          state: "State",
          postal_code: "Postal Code",
          country: "Country",
          search_placeholder: "Search for products...",
          no_results: "No results found",
          add_to_cart: "Add to Cart",
          continue_shopping: "Continue Shopping",
          checkout: "Checkout",
          subtotal: "Subtotal",
          total: "Total",
          shipping: "Shipping",
          tax: "Tax",
          discount: "Discount",
          coupon_code: "Coupon Code",
          apply_coupon: "Apply Coupon",
          order_summary: "Order Summary",
          payment_method: "Payment Method",
          shipping_address: "Shipping Address",
          billing_address: "Billing Address",
          order_confirmation: "Order Confirmation",
          thank_you: "Thank You",
          order_number: "Order Number",
          order_date: "Order Date",
          order_status: "Order Status",
          order_total: "Order Total",
          order_items: "Order Items",
          order_details: "Order Details",
          track_order: "Track Order",
          view_order: "View Order",
          cancel_order: "Cancel Order",
          return_order: "Return Order",
          reorder: "Reorder",
          profile: "Profile",
          edit_profile: "Edit Profile",
          change_password: "Change Password",
          delete_account: "Delete Account",
          account_settings: "Account Settings",
          notification_settings: "Notification Settings",
          privacy_settings: "Privacy Settings",
          security_settings: "Security Settings",
          language_settings: "Language Settings",
          currency_settings: "Currency Settings",
          theme_settings: "Theme Settings",
          dark_mode: "Dark Mode",
          light_mode: "Light Mode",
          system_theme: "System Theme",
          notifications: "Notifications",
          messages: "Messages",
          favorites: "Favorites",
          recently_viewed: "Recently Viewed",
          recommended: "Recommended",
          trending: "Trending",
          new_arrivals: "New Arrivals",
          best_sellers: "Best Sellers",
          on_sale: "On Sale",
          free_shipping: "Free shipping on all orders over $50",
          welcome_back: "Welcome back",
          sign_in_to_continue: "Sign in to continue",
          dont_have_account: "Don't have an account?",
          already_have_account: "Already have an account?",
          forgot_password: "Forgot password?",
          reset_password: "Reset Password",
          create_account: "Create Account",
          sign_in: "Sign In",
          sign_up: "Sign Up",
          sign_out: "Sign Out",
          remember_me: "Remember me",
          or_sign_in_with: "Or sign in with",
          or_sign_up_with: "Or sign up with",
          google: "Google",
          facebook: "Facebook",
          apple: "Apple",
          twitter: "Twitter",
          terms_conditions: "Terms & Conditions",
          privacy_policy: "Privacy Policy",
          agree_terms: "I agree to the Terms & Conditions and Privacy Policy",
          subscribe_newsletter: "Subscribe to our newsletter",
          subscribe: "Subscribe",
          newsletter: "Newsletter",
          newsletter_desc:
            "Get the latest updates on new products and upcoming sales",
          contact_us: "Contact Us",
          contact_info: "Contact Information",
          send_message: "Send Message",
          message: "Message",
          subject: "Subject",
          customer_service: "Customer Service",
          faq: "FAQ",
          help_center: "Help Center",
          shipping_returns: "Shipping & Returns",
          payment_options: "Payment Options",
          size_guide: "Size Guide",
          product_care: "Product Care",
          about_us: "About Us",
          our_story: "Our Story",
          our_team: "Our Team",
          careers: "Careers",
          press: "Press",
          sustainability: "Sustainability",
          social_responsibility: "Social Responsibility",
          blog: "Blog",
          news: "News",
          events: "Events",
          tutorials: "Tutorials",
          tips: "Tips",
          inspiration: "Inspiration",
          follow_us: "Follow Us",
          social_media: "Social Media",
          instagram: "Instagram",
          facebook: "Facebook",
          twitter: "Twitter",
          pinterest: "Pinterest",
          youtube: "YouTube",
          tiktok: "TikTok",
          download_app: "Download Our App",
          app_store: "App Store",
          google_play: "Google Play",
          copyright: "© 2023 NIRE. All rights reserved.",
          powered_by: "Powered by",
          designed_by: "Designed by",
          developed_by: "Developed by",
          version: "Version",
          last_updated: "Last Updated",
          error: "Error",
          success: "Success",
          warning: "Warning",
          info: "Info",
          loading: "Loading...",
          please_wait: "Please wait...",
          processing: "Processing...",
          saving: "Saving...",
          updating: "Updating...",
          deleting: "Deleting...",
          creating: "Creating...",
          sending: "Sending...",
          uploading: "Uploading...",
          downloading: "Downloading...",
          searching: "Searching...",
          filtering: "Filtering...",
          sorting: "Sorting...",
          loading_more: "Loading more...",
          no_more_items: "No more items",
          end_of_list: "End of list",
          no_items: "No items",
          empty_list: "Empty list",
          no_data: "No data",
          no_results_found: "No results found",
          try_again: "Try again",
          refresh: "Refresh",
          retry: "Retry",
          back: "Back",
          next: "Next",
          previous: "Previous",
          first: "First",
          last: "Last",
          page: "Page",
          of: "of",
          items_per_page: "Items per page",
          show_more: "Show more",
          show_less: "Show less",
          view_all: "View all",
          view_more: "View more",
          view_less: "View less",
          view_details: "View details",
          edit: "Edit",
          delete: "Delete",
          remove: "Remove",
          add: "Add",
          create: "Create",
          update: "Update",
          save: "Save",
          apply: "Apply",
          clear: "Clear",
          reset: "Reset",
          cancel: "Cancel",
          confirm: "Confirm",
          yes: "Yes",
          no: "No",
          ok: "OK",
          done: "Done",
          close: "Close",
          select: "Select",
          select_all: "Select all",
          deselect_all: "Deselect all",
          select_option: "Select option",
          selected: "Selected",
          filter: "Filter",
          sort: "Sort",
          sort_by: "Sort by",
          search: "Search",
          search_for: "Search for",
          search_results: "Search results",
          search_results_for: "Search results for",
          search_no_results: "No search results",
          search_no_results_for: "No search results for",
          search_try_again: "Try searching for something else",
          search_suggestions: "Search suggestions",
          popular_searches: "Popular searches",
          recent_searches: "Recent searches",
          clear_recent_searches: "Clear recent searches",
          save_search: "Save search",
          saved_searches: "Saved searches",
          clear_saved_searches: "Clear saved searches",
          save_filter: "Save filter",
          saved_filters: "Saved filters",
          clear_saved_filters: "Clear saved filters",
          save_sort: "Save sort",
          saved_sorts: "Saved sorts",
          clear_saved_sorts: "Clear saved sorts",
          save_view: "Save view",
          saved_views: "Saved views",
          clear_saved_views: "Clear saved views",
          save_layout: "Save layout",
          saved_layouts: "Saved layouts",
          clear_saved_layouts: "Clear saved layouts",
          save_theme: "Save theme",
          saved_themes: "Saved themes",
          clear_saved_themes: "Clear saved themes",
          save_settings: "Save settings",
          saved_settings: "Saved settings",
          clear_saved_settings: "Clear saved settings",
          reset_settings: "Reset settings",
          reset_to_default: "Reset to default",
          default: "Default",
          custom: "Custom",
          customize: "Customize",
          preferences: "Preferences",
          options: "Options",
          advanced: "Advanced",
          basic: "Basic",
          simple: "Simple",
          detailed: "Detailed",
          compact: "Compact",
          expanded: "Expanded",
          grid: "Grid",
          list: "List",
          table: "Table",
          cards: "Cards",
          tiles: "Tiles",
          thumbnails: "Thumbnails",
          gallery: "Gallery",
          slideshow: "Slideshow",
          carousel: "Carousel",
          banner: "Banner",
          hero: "Hero",
          featured: "Featured",
          spotlight: "Spotlight",
          highlight: "Highlight",
          showcase: "Showcase",
          display: "Display",
          layout: "Layout",
          theme: "Theme",
          color: "Color",
          style: "Style",
          size: "Size",
          shape: "Shape",
          position: "Position",
          alignment: "Alignment",
          spacing: "Spacing",
          padding: "Padding",
          margin: "Margin",
          border: "Border",
          shadow: "Shadow",
          opacity: "Opacity",
          transparency: "Transparency",
          visibility: "Visibility",
          hidden: "Hidden",
          visible: "Visible",
          show: "Show",
          hide: "Hide",
          expand: "Expand",
          collapse: "Collapse",
          open: "Open",
          close: "Close",
          enable: "Enable",
          disable: "Disable",
          on: "On",
          off: "Off",
          active: "Active",
          inactive: "Inactive",
          enabled: "Enabled",
          disabled: "Disabled",
          locked: "Locked",
          unlocked: "Unlocked",
          public: "Public",
          private: "Private",
          shared: "Shared",
          personal: "Personal",
          system: "System",
          user: "User",
          admin: "Admin",
          guest: "Guest",
          member: "Member",
          customer: "Customer",
          client: "Client",
          partner: "Partner",
          vendor: "Vendor",
          supplier: "Supplier",
          manufacturer: "Manufacturer",
          brand: "Brand",
          category: "Category",
          subcategory: "Subcategory",
          tag: "Tag",
          label: "Label",
          status: "Status",
          state: "State",
          condition: "Condition",
          availability: "Availability",
          in_stock: "In Stock",
          out_of_stock: "Out of Stock",
          low_stock: "Low Stock",
          back_order: "Back Order",
          pre_order: "Pre-Order",
          discontinued: "Discontinued",
          new: "New",
          sale: "Sale",
          clearance: "Clearance",
          promotion: "Promotion",
          deal: "Deal",
          offer: "Offer",
          discount: "Discount",
          coupon: "Coupon",
          voucher: "Voucher",
          gift_card: "Gift Card",
          reward: "Reward",
          loyalty: "Loyalty",
          points: "Points",
          credits: "Credits",
          balance: "Balance",
          wallet: "Wallet",
          payment: "Payment",
          refund: "Refund",
          exchange: "Exchange",
          return: "Return",
          shipping: "Shipping",
          delivery: "Delivery",
          pickup: "Pickup",
          tracking: "Tracking",
          order: "Order",
          invoice: "Invoice",
          receipt: "Receipt",
          transaction: "Transaction",
          purchase: "Purchase",
          sale: "Sale",
          subscription: "Subscription",
          membership: "Membership",
          plan: "Plan",
          package: "Package",
          bundle: "Bundle",
          set: "Set",
          kit: "Kit",
          collection: "Collection",
          series: "Series",
          line: "Line",
          range: "Range",
          group: "Group",
          family: "Family",
          type: "Type",
          model: "Model",
          version: "Version",
          edition: "Edition",
          release: "Release",
          update: "Update",
          upgrade: "Upgrade",
          downgrade: "Downgrade",
          install: "Install",
          uninstall: "Uninstall",
          download: "Download",
          upload: "Upload",
          import: "Import",
          export: "Export",
          backup: "Backup",
          restore: "Restore",
          sync: "Sync",
          synchronize: "Synchronize",
          connect: "Connect",
          disconnect: "Disconnect",
          link: "Link",
          unlink: "Unlink",
          attach: "Attach",
          detach: "Detach",
          assign: "Assign",
          unassign: "Unassign",
          allocate: "Allocate",
          deallocate: "Deallocate",
          reserve: "Reserve",
          unreserve: "Unreserve",
          book: "Book",
          unbook: "Unbook",
          schedule: "Schedule",
          unschedule: "Unschedule",
          calendar: "Calendar",
          date: "Date",
          time: "Time",
          duration: "Duration",
          period: "Period",
          interval: "Interval",
          frequency: "Frequency",
          recurrence: "Recurrence",
          repeat: "Repeat",
          daily: "Daily",
          weekly: "Weekly",
          monthly: "Monthly",
          yearly: "Yearly",
          day: "Day",
          week: "Week",
          month: "Month",
          year: "Year",
          today: "Today",
          tomorrow: "Tomorrow",
          yesterday: "Yesterday",
          now: "Now",
          later: "Later",
          soon: "Soon",
          never: "Never",
          always: "Always",
          sometimes: "Sometimes",
          often: "Often",
          rarely: "Rarely",
          frequently: "Frequently",
          occasionally: "Occasionally",
          regularly: "Regularly",
          irregularly: "Irregularly",
          periodically: "Periodically",
          sporadically: "Sporadically",
          continuously: "Continuously",
          intermittently: "Intermittently",
          temporarily: "Temporarily",
          permanently: "Permanently",
          temporarily: "Temporarily",
          indefinitely: "Indefinitely",
          temporarily: "Temporarily",
          briefly: "Briefly",
          shortly: "Shortly",
          quickly: "Quickly",
          slowly: "Slowly",
          gradually: "Gradually",
          suddenly: "Suddenly",
          immediately: "Immediately",
          instantly: "Instantly",
          eventually: "Eventually",
          finally: "Finally",
          ultimately: "Ultimately",
          eventually: "Eventually",
          subsequently: "Subsequently",
          consequently: "Consequently",
          therefore: "Therefore",
          thus: "Thus",
          hence: "Hence",
          so: "So",
          because: "Because",
          since: "Since",
          as: "As",
          due_to: "Due to",
          owing_to: "Owing to",
          thanks_to: "Thanks to",
          despite: "Despite",
          in_spite_of: "In spite of",
          regardless_of: "Regardless of",
          notwithstanding: "Notwithstanding",
          nevertheless: "Nevertheless",
          nonetheless: "Nonetheless",
          however: "However",
          but: "But",
          yet: "Yet",
          still: "Still",
          although: "Although",
          though: "Though",
          even_though: "Even though",
          even_if: "Even if",
          if: "If",
          unless: "Unless",
          until: "Until",
          when: "When",
          whenever: "Whenever",
          where: "Where",
          wherever: "Wherever",
          while: "While",
          as_long_as: "As long as",
          as_soon_as: "As soon as",
          as_far_as: "As far as",
          as_much_as: "As much as",
          as_many_as: "As many as",
          as_little_as: "As little as",
          as_few_as: "As few as",
          more: "More",
          less: "Less",
          most: "Most",
          least: "Least",
          more_than: "More than",
          less_than: "Less than",
          most_of: "Most of",
          least_of: "Least of",
          all: "All",
          none: "None",
          any: "Any",
          some: "Some",
          many: "Many",
          few: "Few",
          several: "Several",
          numerous: "Numerous",
          various: "Various",
          diverse: "Diverse",
          different: "Different",
          similar: "Similar",
          same: "Same",
          identical: "Identical",
          equivalent: "Equivalent",
          equal: "Equal",
          unequal: "Unequal",
          comparable: "Comparable",
          incomparable: "Incomparable",
          like: "Like",
          unlike: "Unlike",
          similar_to: "Similar to",
          different_from: "Different from",
          same_as: "Same as",
          other_than: "Other than",
          rather_than: "Rather than",
          instead_of: "Instead of",
          in_place_of: "In place of",
          in_lieu_of: "In lieu of",
          in_addition_to: "In addition to",
          besides: "Besides",
          apart_from: "Apart from",
          except_for: "Except for",
          excluding: "Excluding",
          including: "Including",
          inclusive_of: "Inclusive of",
          exclusive_of: "Exclusive of",
          with: "With",
          without: "Without",
          within: "Within",
          outside: "Outside",
          inside: "Inside",
          internal: "Internal",
          external: "External",
          domestic: "Domestic",
          foreign: "Foreign",
          local: "Local",
          global: "Global",
          regional: "Regional",
          national: "National",
          international: "International",
          worldwide: "Worldwide",
          universal: "Universal",
          global: "Global",
          local: "Local",
          regional: "Regional",
          national: "National",
        },
        vi: {
          // Common
          home: "Trang chủ",
          shop: "Cửa hàng",
          about: "Về chúng tôi",
          contact: "Liên hệ",
          blog: "Blog",
          search: "Tìm kiếm",
          account: "Tài khoản",
          wishlist: "Yêu thích",
          cart: "Giỏ hàng",
          login: "Đăng nhập",
          register: "Đăng ký",
          logout: "Đăng xuất",
          my_account: "Tài khoản của tôi",
          settings: "Cài đặt",
          orders: "Đơn hàng",
          addresses: "Địa chỉ",
          payment_methods: "Phương thức thanh toán",
          language: "Ngôn ngữ",
          english: "Tiếng Anh",
          vietnamese: "Tiếng Việt",
          save_changes: "Lưu thay đổi",
          cancel: "Hủy",
          submit: "Gửi",
          email: "Email",
          password: "Mật khẩu",
          confirm_password: "Xác nhận mật khẩu",
          name: "Tên",
          phone: "Điện thoại",
          address: "Địa chỉ",
          city: "Thành phố",
          state: "Tỉnh/Thành",
          postal_code: "Mã bưu điện",
          country: "Quốc gia",
          search_placeholder: "Tìm kiếm sản phẩm...",
          no_results: "Không tìm thấy kết quả",
          add_to_cart: "Thêm vào giỏ hàng",
          continue_shopping: "Tiếp tục mua sắm",
          checkout: "Thanh toán",
          subtotal: "Tạm tính",
          total: "Tổng cộng",
          shipping: "Phí vận chuyển",
          tax: "Thuế",
          discount: "Giảm giá",
          coupon_code: "Mã giảm giá",
          apply_coupon: "Áp dụng",
          order_summary: "Tóm tắt đơn hàng",
          payment_method: "Phương thức thanh toán",
          shipping_address: "Địa chỉ giao hàng",
          billing_address: "Địa chỉ thanh toán",
          order_confirmation: "Xác nhận đơn hàng",
          thank_you: "Cảm ơn bạn",
          order_number: "Mã đơn hàng",
          order_date: "Ngày đặt hàng",
          order_status: "Trạng thái đơn hàng",
          order_total: "Tổng đơn hàng",
          order_items: "Sản phẩm đã đặt",
          order_details: "Chi tiết đơn hàng",
          track_order: "Theo dõi đơn hàng",
          view_order: "Xem đơn hàng",
          cancel_order: "Hủy đơn hàng",
          return_order: "Trả hàng",
          reorder: "Đặt lại",
          profile: "Hồ sơ",
          edit_profile: "Chỉnh sửa hồ sơ",
          change_password: "Đổi mật khẩu",
          delete_account: "Xóa tài khoản",
          account_settings: "Cài đặt tài khoản",
          notification_settings: "Cài đặt thông báo",
          privacy_settings: "Cài đặt quyền riêng tư",
          security_settings: "Cài đặt bảo mật",
          language_settings: "Cài đặt ngôn ngữ",
          currency_settings: "Cài đặt tiền tệ",
          theme_settings: "Cài đặt giao diện",
          dark_mode: "Chế độ tối",
          light_mode: "Chế độ sáng",
          system_theme: "Theo hệ thống",
          notifications: "Thông báo",
          messages: "Tin nhắn",
          favorites: "Yêu thích",
          recently_viewed: "Đã xem gần đây",
          recommended: "Đề xuất",
          trending: "Xu hướng",
          new_arrivals: "Hàng mới về",
          best_sellers: "Bán chạy nhất",
          on_sale: "Đang giảm giá",
          free_shipping: "Miễn phí vận chuyển cho đơn hàng trên $50",
          welcome_back: "Chào mừng trở lại",
          sign_in_to_continue: "Đăng nhập để tiếp tục",
          dont_have_account: "Chưa có tài khoản?",
          already_have_account: "Đã có tài khoản?",
          forgot_password: "Quên mật khẩu?",
          reset_password: "Đặt lại mật khẩu",
          create_account: "Tạo tài khoản",
          sign_in: "Đăng nhập",
          sign_up: "Đăng ký",
          sign_out: "Đăng xuất",
          remember_me: "Ghi nhớ đăng nhập",
          or_sign_in_with: "Hoặc đăng nhập với",
          or_sign_up_with: "Hoặc đăng ký với",
          google: "Google",
          facebook: "Facebook",
          apple: "Apple",
          twitter: "Twitter",
          terms_conditions: "Điều khoản & Điều kiện",
          privacy_policy: "Chính sách bảo mật",
          agree_terms:
            "Tôi đồng ý với Điều khoản & Điều kiện và Chính sách bảo mật",
          subscribe_newsletter: "Đăng ký nhận bản tin",
          subscribe: "Đăng ký",
          newsletter: "Bản tin",
          newsletter_desc:
            "Nhận thông tin cập nhật về sản phẩm mới và khuyến mãi sắp tới",
          contact_us: "Liên hệ với chúng tôi",
          contact_info: "Thông tin liên hệ",
          send_message: "Gửi tin nhắn",
          message: "Tin nhắn",
          subject: "Chủ đề",
          customer_service: "Dịch vụ khách hàng",
          faq: "Câu hỏi thường gặp",
          help_center: "Trung tâm trợ giúp",
          shipping_returns: "Vận chuyển & Trả hàng",
          payment_options: "Phương thức thanh toán",
          free_shipping: "Miễn phí vận chuyển cho đơn hàng trên $50",
        },
      },

      t: (key) => {
        const { language, translations } = get();
        return translations[language][key] || key;
      },
    }),
    {
      name: "nire-beauty-language", // name of the item in localStorage
    }
  )
);

// Search Store
type SearchState = {
  query: string;
  results: any[];
  isSearching: boolean;
  setQuery: (query: string) => void;
  search: (query: string) => void;
  clearSearch: () => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  results: [],
  isSearching: false,

  setQuery: (query) => {
    set({ query });
  },

  search: (query) => {
    set({ isSearching: true, query });

    // Simulate search API call
    setTimeout(() => {
      // Sample search results
      const results =
        query.trim() === ""
          ? []
          : [
              {
                id: 1,
                name: "Facial Cleanser",
                price: 29.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Skin Care",
              },
              {
                id: 2,
                name: "Moisturizer",
                price: 34.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Skin Care",
              },
              {
                id: 3,
                name: "Face Serum",
                price: 49.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Skin Care",
              },
              {
                id: 6,
                name: "Perfume Collection",
                price: 59.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Fragrance",
              },
              {
                id: 11,
                name: "Beauty Tool",
                price: 19.99,
                image: "/placeholder.svg?height=200&width=200",
                category: "Accessories",
              },
            ].filter(
              (product) =>
                product.name.toLowerCase().includes(query.toLowerCase()) ||
                product.category.toLowerCase().includes(query.toLowerCase())
            );

      set({ results, isSearching: false });
    }, 500);
  },

  clearSearch: () => {
    set({ query: "", results: [], isSearching: false });
  },
}));
