import { useBackdrop } from "@/context/backdrop_context";
import { useServiceLogout } from "@/services/auth/services";
import { useAppDispatch } from "@/stores";
import { clearInfoUser } from "@/stores/user-slice";
import { removeAuthStorage } from "@/utils/local-storage";

export default function useLogout() {
    const { mutate: logout } = useServiceLogout();
    const dispatch = useAppDispatch();
    const { showBackdrop, hideBackdrop } = useBackdrop();


    const handleLogout = () => {
        showBackdrop();
        logout(undefined, {
            onSuccess: () => {
            },
            onError: () => {
            },
            onSettled: () => {
                hideBackdrop();
                dispatch(clearInfoUser());
                removeAuthStorage();
                location.href = "/";
            },
        });
    };

    return { handleLogout };
}
